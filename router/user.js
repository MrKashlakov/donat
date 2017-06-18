import { Router } from 'express';

const router = Router();

router.get('/user', (req, res) => {
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

