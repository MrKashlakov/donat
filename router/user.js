import { Router } from 'express';
import { Wallet } from 'yandex-money-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { User } from '../pages';
import { Widget as WidgetModel } from '../models';

const router = Router();

router.get('/', (req, res) => {
  if (req.cookies.token === undefined) {
    res.status(401).redirect('/');
  }

  const api = new Wallet(req.cookies.token);

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

export default router;

