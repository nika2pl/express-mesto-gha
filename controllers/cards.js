const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  OK_STATUS,
  OK_CREATED,
  ERROR_INCORRECT_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/http_codes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.status(OK_STATUS).send(data))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail()
    .then((data) => res.status(OK_STATUS).send(data))
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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((data) => res.status(OK_CREATED).send(data))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

const updateCardLikedState = (req, res, query, httpCode) => {
  Card.findByIdAndUpdate(
    {
      owner: req.user._id,
    },
    query,
    { new: true },
  ).orFail().then((data) => res.status(httpCode).send(data)).catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
    } else if (err instanceof mongoose.Error.CastError) {
      res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка: ${err.message}` });
    }
  });
};

module.exports.likeCard = (req, res) => updateCardLikedState(req, res, {
  $addToSet: { likes: req.user._id },
}, OK_CREATED);

module.exports.dislikeCard = (req, res) => updateCardLikedState(req, res, {
  $pull: { likes: req.user._id },
}, OK_STATUS);
