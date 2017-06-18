import { Router } from 'express';
import { Wallet } from 'yandex-money-sdk';
import {
  clientId,
  redirectURI,
  clientSecret,
} from '../config';

const router = Router();
const url = Wallet.buildObtainTokenUrl(clientId, redirectURI, ['account-info', 'operation-history', 'incoming-transfers', 'payment']);

router.get('/', (req, res) => {
  res.redirect(url);
});

router.get('/save', (req, res) => {
  Wallet.getAccessToken(clientId, req.query.code, redirectURI, clientSecret, (err, data) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect('/');
    }

    res.cookie('token', `${data.access_token}`);
    res.redirect('/user');
  });
});

export default router;

