const Card = require('../models/card');
const {
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .then((data) => (
      !data
        ? res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' })
        : res.send(data)
    ))
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Карточка не найдена' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId  = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((data) => res.status(201).send(data))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' })
        : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((data) => (
  !data
    ? res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' })
    : res.status(201).send(data)
)).catch((err) => (
  err.name === 'CastError'
    ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Карточка не найдена' })
    : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((data) => (
  !data
    ? res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' })
    : res.send(data)
)).catch((err) => (
  err.name === 'CastError'
    ? res.status(ERROR_INCORRECT_DATA).send({ message: 'Карточка не найдена' })
    : res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` })
));
