const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const { URL_MONGO, PORT } = require('./utils/config');
const { requestLogger } = require('./middlewares/logger');
const router = require('./routes');

const app = express();

mongoose.connect(URL_MONGO, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.listen(PORT);
