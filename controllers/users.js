const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => res.send(user))
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Пользователь не найден' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};
