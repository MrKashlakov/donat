import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './router';
import http from 'http';
import { listen } from 'socket.io';

const PORT = '3000';
const SOCKET_PORT = '5000';
const HOST = 'localhost';
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

router(app, io);

io.listen(SOCKET_PORT);
app.listen(PORT, HOST, (err) => {
  if (err) {
    throw new Error(err.message);
  }

  console.log(`http://${HOST}:${PORT}`);
});
