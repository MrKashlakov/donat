import { Router } from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import { Main } from '../pages';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send(`<!doctype html>${renderToStaticMarkup(Main())}`);
});

export default router;

