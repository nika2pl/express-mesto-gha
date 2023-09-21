const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const routeSignup = require('./routes/auth/signup');
const routeSignin = require('./routes/auth/signin');
const { usersRouter, cardsRouter } = require('./routes/index');
const { INTERNAL_SERVER_STATUS } = require('./utils/http_codes');
const { URL_MONGO } = require('./utils/config');
const NotFound = require('./utils/errors/NotFound');

const app = express();

mongoose.connect(URL_MONGO, {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// не требует авторизации
app.use('/', routeSignup);
app.use('/', routeSignin);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

app.use(errors()); // handle errors by celebrate

app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err; // 500 by default
  res.status(statusCode).send({ message });

  next();
});

app.listen(3000);
