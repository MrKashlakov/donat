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
const config = require('./../config.json');
const clientId = config.clientId;
const clientSecret = config.clientSecret;
const scope = ['account-info', 'operation-history'];
const redirectURI = 'http://localhost:3000/user';
const url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);

app.get('/auth', (req, res) => {
  res.redirect(url);
});

const tokenComplete = (req, res) => (err, data) => {
  if (err) {
    throw new Error(err);
  }

  const access_token = data.access_token;
  const api = new yandexMoney.Wallet(access_token);

  api.accountInfo((err, data) => {
    if (err) {
      throw new Error(err);
    }
      console.log(2, data)
  });

  res.header('Authorization', `Bearer ${access_token}`);
};

app.get('/user', (req, res) => {
  const code = req.query.code;

  yandexMoney.Wallet.getAccessToken(clientId, code, redirectURI, clientSecret, tokenComplete(req, res));
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
