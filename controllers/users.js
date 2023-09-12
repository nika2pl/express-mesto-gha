const mongoose = require('mongoose');
const User = require('../models/user');
const {
  OK_STATUS,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  OK_CREATED,
} = require('../utils/http_codes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send(users))
    .catch((err) => res
      .status(ERROR_INTERNAL_SERVER)
      .send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .orFail()
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(OK_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
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
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err instanceof mongoose.Error.CastError) {
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
