const express = require('express');

const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { usersRouter, cardsRouter } = require('./routes/index');

const { ERROR_NOT_FOUND } = require('./utils/http_codes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64ff4ab90918aebf7f87a3d2',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Заданного URL не существует.' }));
});

app.listen(3000);
