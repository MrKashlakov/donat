import { Router } from 'express';
import { Wallet } from 'yandex-money-sdk';
import {
  clientId,
  redirectURI,
  clientSecret,
} from './config';

const router = Router();
const url = Wallet.buildObtainTokenUrl(clientId, redirectURI, ['account-info', 'operation-history', 'incoming-transfers', 'payment']);

router.get('/auth', (req, res) => {
  res.redirect(url);
});

router.get('/auth/save', (req, res) => {
  Wallet.getAccessToken(clientId, req.query.code, redirectURI, clientSecret, (err, data) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.cookie('token', `${data.access_token}`);
    res.redirect('/user');
  });
});

