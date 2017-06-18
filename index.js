import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './router';

const PORT = '3000';
const HOST = 'localhost';
const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

//router(app);

app.listen(PORT, HOST, (err) => {
  if (err) {
    throw new Error(err.message);
  }

  console.log(`http://${HOST}:${PORT}`);
});
