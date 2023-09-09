const express = require('express');

const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb+srv://n123:K2mzvnZRZjTPFgDZ@cluster0.p9go750.mongodb.net/mestodb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64fc543971213f04ce34cf65',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.listen(3000);
