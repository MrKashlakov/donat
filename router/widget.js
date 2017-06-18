import { Router } from 'express';
import mongoose from 'mongoose';
import { Wallet } from 'yandex-money-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { Widget } from '../pages';
import { Widget as WidgetModel } from '../models';

mongoose.connect('mongodb://localhost/widget');

const router = Router();

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
  if (req.cookies.token === undefined) {
    res.status(400).redirect('/user');
  }

  const api = new Wallet(req.cookies.token);

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

export default router;

