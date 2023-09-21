/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  OK_STATUS,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  OK_CREATED,
} = require('../utils/http_codes');

module.exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail()
    .then((user) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          res.status(ERROR_NOT_FOUND).send({ message: 'Неправильный email или пароль' });
        } else {
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

          // отправим токен, браузер сохранит его в куках
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          }).end();
        }
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Неправильный email или пароль' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некоррекsтные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.signup = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(OK_CREATED).send(user))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
          } else {
            res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
          }
        });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send(users))
    .catch((err) => res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  let userId;

  if (req.method === 'GET') {
    userId = req.user._id;
  } else {
    userId = req.params.userId;
  }

  User.findOne({ _id: userId })
    .orFail()
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

const updateUser = (req, res, data) => {
  User.findOneAndUpdate({ _id: req.user._id }, data, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => res.status(OK_STATUS).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  return updateUser(req, res, { name, about });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  return updateUser(req, res, { avatar });
};
