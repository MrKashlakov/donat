/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const GetDonationController = require('./controllers/get-donation');
import CompaniesController from './controllers/companies';

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

const yandexMoney = require('yandex-money-sdk');
const cookieParser = require('cookie-parser');
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const mongoose = require('mongoose');
const config = require('../config.json');
const REDIRECT_URI = 'http://localhost:3000/save';
const clientId = config.clientId;
const clientSecret = config.clientSecret;
const url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, REDIRECT_URI, ['account-info', 'operation-history', 'incoming-transfers', 'payment']);
const Html = ({ children }) => createElement('html', null, createElement('body', null, children));
const Widget = ({ _id }) => createElement('a', {
  href: `/widget?id=${_id}`,
}, `widget ${_id}`);
const Widgets = ({ widgets }) => createElement('div', null, widgets.map(({ _id }, key) => createElement(Widget, {
  _id,
  key,
})));
const AddWidget = () => createElement('form', {
  action: '/widget',
  method: 'post',
}, createElement('button', {
  type: 'submit',
}, 'Add widget'));
const User = ({ widgets }) => createElement(Html, null, createElement(AddWidget, null), createElement(Widgets, {
  widgets,
}));
const WidgetModel = mongoose.model('Widget', mongoose.Schema({
  account: String,
}));
const Pay = ({ account }) => createElement('form', {
  method: 'post',
}, createElement('input', {
  type: 'hidden',
  name: 'account',
  value: account,
}), createElement('input', {
  type: 'radio',
  name: 'type',
  value: 'wallet',
  defaultChecked: true,
}), createElement('input', {
  type: 'radio',
  name: 'type',
  value: 'card',
}), createElement('input', {
  type: 'number',
  name: 'amount',
}), createElement('button', {
  type: 'submit',
}, 'Pay'));
const Page = (props) => createElement(Html, null, createElement(Pay, props));
const FormRedirect = ({ action, params }) => createElement('form', {
  method: 'post',
  action,
}, Object.keys(params).map((name, key) => createElement('input', {
  key,
  type: 'hidden',
  name,
  value: params[name],
})), createElement('button', {
  type: 'submit',
}, 'Redirect'));
const Redirect = (props) => createElement(Html, null, createElement(FormRedirect, props));
const SuccessPage = () => createElement(Html, null, createElement('div', null, 'success'));
const FailPage = () => createElement(Html, null, createElement('div', null, 'fail'));

mongoose.connect('mongodb://localhost/widget');

app.use(cookieParser());

app.get('/auth', (req, res) => {
  res.redirect(url);
});

const companiesController = new CompaniesController();
app.get('/companies', (req, res) => companiesController.handle(req, res));

app.get('/save', (req, res) => {
  yandexMoney.Wallet.getAccessToken(clientId, req.query.code, REDIRECT_URI, clientSecret, (err, data) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.cookie('token', `${data.access_token}`);
    res.redirect('/user');
  });
});

app.get('/user', (req, res) => {
  if (req.cookies.token === undefined) {
    res.status(401).redirect('/');
  }

  const api = new yandexMoney.Wallet(req.cookies.token);

  api.accountInfo((err, { account }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    WidgetModel.find({
      account,
    }, (err, widgets) => {
      if (err !== null) {
        console.error(err);

        res.status(400).redirect('/');
      }

      res.status(200).send(`<!doctype html>${renderToStaticMarkup(User({
        widgets,
      }))}`);
    });
  });
});

app.get('/widget', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  WidgetModel.findById(req.query.id, (err, { _id }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.status(200).send(`<!doctype html>${renderToStaticMarkup(Widget({
      _id,
    }))}`);
  });
});

app.post('/widget', (req, res) => {
  if (req.cookies.token === undefined) {
    res.status(400).redirect('/user');
  }

  const api = new yandexMoney.Wallet(req.cookies.token);

  api.accountInfo((err, { account }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/user');
    }

    WidgetModel.create({
      account,
    }, (err, data) => {
      if (err !== null) {
        console.error(err);

        res.status(400).redirect('/user');
      }

      res.status(200).redirect('/user');
    });
  });
});

app.get('/page', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  WidgetModel.findById(req.query.id, (err, { account }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.status(200).send(`<!doctype html>${renderToStaticMarkup(Page({
      account,
    }))}`);
  });
});

app.post('/page', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  yandexMoney.ExternalPayment.getInstanceId(clientId, (err, { instance_id }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect(`/page?id=${req.query.id}`);
    }

    if (req.body.type === 'wallet') {
      const api = new yandexMoney.Wallet(req.cookies.token);

      api.requestPayment({
        'test_payment': true,
        'test_card': 'available',
        'test_result': 'success',
        'pattern_id': 'p2p',
        instance_id,
        to: req.body.account,
        amount: req.body.amount,
        message: req.query.id,
      }, (err, { request_id }) => {
        if (err !== null) {
          console.error(err);

          res.status(400).redirect(`/page?id=${req.query.id}`);
        }
        console.log(data)

        api.processPayment({
          request_id,
        }, (err, data) => {
          if (err !== null) {
            console.error(err);

            res.status(400).redirect(`/page?id=${req.query.id}`);
          }

          console.log(data);

          res.status(200).redirect(`/page?id=${req.query.id}`);
        });
      });
    }
    else {
      const externalPayment = new yandexMoney.ExternalPayment(instance_id);

      externalPayment.request({
        instance_id,
        to: req.body.account,
        amount: req.body.amount,
        message: req.query.id,
      }, (err, data) => {
        if (err !== null) {
          console.error(err);

          res.status(400).redirect(`/page?id=${req.query.id}`);
        }

        externalPayment.process({
          'request_id': data.request_id,
          'ext_auth_success_uri': `http://localhost:3000/page/success?id=${req.query.id}`,
          'ext_auth_fail_uri': `http://localhost:3000/page/fail?id=${req.query.id}`,
        }, (err, data) => {
          if (err !== null) {
            console.error(err);

            res.status(400).redirect(`/page?id=${req.query.id}`);
          }
          console.log(data)

          if (data.status === 'ext_auth_required') {
            const { acs_uri:action, acs_params:params } = data;

            res.status(200).send(`<!doctype html>${renderToStaticMarkup(Redirect({
              action,
              params,
            }))}`);
          }
          else {
            res.status(200).redirect(`/page?id=${req.query.id}`);
          }
        });
      });
    }
  });
});

app.get('/page/save', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  WidgetModel.findById(req.query.id, (err) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.status(200).send(`<!doctype html>${renderToStaticMarkup(SuccessPage())}`);
  });
});

app.get('/page/fail', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  WidgetModel.findById(req.query.id, (err) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.status(200).send(`<!doctype html>${renderToStaticMarkup(FailPage())}`);
  });
});

io.listen(5000);

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
