const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const auth = require('./middlewares/auth');
const { authRouter, usersRouter, cardsRouter } = require('./routes/index');
const { ERROR_NOT_FOUND } = require('./utils/http_codes');

// не требует авторизации
app.use('/users', authRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Заданного URL не существует.' }));
});

app.listen(3000);
