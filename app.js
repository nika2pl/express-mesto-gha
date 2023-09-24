const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { URL_MONGO } = require('./utils/config');
const router = require('./routes');

const app = express();

mongoose.connect(URL_MONGO, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.listen(3000);
