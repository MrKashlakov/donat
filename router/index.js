import express from 'express';
import path from 'path';
import main from './main';
import auth from './auth';
import user from './user';
import widget from './widget';
import page from './page';

export default (app) => {
  app.use('/', main);
  app.use('/static', express.static(path.join(__dirname, '../client')));
  app.use('/auth', auth);
  app.use('/user', user);
  app.use('/widget', widget);
  app.use('/page', page);
};

