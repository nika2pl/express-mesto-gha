const express = require('express');

const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { ERROR_NOT_FOUND } = require('./utils/errors');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64fc543971213f04ce34cf65',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res, next) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Заданного URL не существует.' }));
});

app.listen(3000);
