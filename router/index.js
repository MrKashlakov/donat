import auth from './auth';
//import user from './user';
//import widget from './widget';
//import page from './page';

export default (app) => {
  app.use('/auth', auth);
  //app.use('/user', user);
  //app.use('/widget', widget);
  //app.use('/page', page);
};

