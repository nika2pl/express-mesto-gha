const mongoose = require('mongoose');
const User = require('../models/user');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.userId }).orFail()
    .then((user) => res.send(user)).catch((err) => (
      err instanceof mongoose.Error.DocumentNotFoundError
        ? res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => (
      err instanceof mongoose.Error.ValidationError
        ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => (
      err instanceof mongoose.Error.ValidationError
        ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => (
      err instanceof mongoose.Error.ValidationError
        ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};
