import { Router } from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExternalPayment } from 'yandex-money-sdk';
import {
  Page,
  Redirect,
  SuccessPage,
  FailPage,
} from '../pages';
import { Widget as WidgetModel } from '../models';
import { clientId } from '../config';

const router = Router();

router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
  if (req.query.id === undefined) {
    res.status(400).redirect('/');
  }

  ExternalPayment.getInstanceId(clientId, (err, { instance_id }) => {
    if (err !== null) {
      console.error(err);

      res.status(400).redirect(`/page?id=${req.query.id}`);
    }

    if (req.body.type === 'wallet') {
      const api = new Wallet(req.cookies.token);

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
      const externalPayment = new ExternalPayment(instance_id);

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

router.get('/success', (req, res) => {
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

router.get('/fail', (req, res) => {
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

export default router;

