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

const donationController = new GetDonationController();
app.post('/donation', (req, res) => donationController.handle(req, res, io));

const yandexMoney = require('yandex-money-sdk');
const cookieParser = require('cookie-parser');
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const config = require('../config.json');
const REDIRECT_URI = 'http://localhost:3000/save';
const clientId = config.clientId;
const clientSecret = config.clientSecret;
const url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, REDIRECT_URI, ['account-info', 'operation-history', 'incoming-transfers']);
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
const mongoose = require('mongoose');
const WidgetModel = mongoose.model('Widget', mongoose.Schema({
  account: String,
}));

mongoose.connect('mongodb://localhost/widget');

app.use(cookieParser());

app.get('/auth', (req, res) => {
  res.redirect(url);
});

app.get('/save', (req, res) => {
  yandexMoney.Wallet.getAccessToken(clientId, req.query.code, REDIRECT_URI, clientSecret, (err, data) => {
    if (err) {
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
    if (err) {
      console.error(err);

      res.status(400).redirect('/');
    }

    WidgetModel.find({
      account,
    }, (err, widgets) => {
      if (err) {
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
    if (err) {
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
    if (err) {
      console.error(err);

      res.status(400).redirect('/user');
    }

    WidgetModel.create({
      account,
    }, (err, data) => {
      if (err) {
        console.error(err);

        res.status(400).redirect('/user');
      }

      res.status(200).redirect('/user');
    });
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
