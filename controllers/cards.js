const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .then((data) => res.send(data))
    .catch((err) => (
      err.name === 'CastError'
        ? res.status(400).send({ message: 'Карточка не найдена' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((data) => res.send(data))
    .catch((err) => (
      err.name === 'ValidationError'
        ? res.status(400).send({ message: 'Переданы некорректные данные' })
        : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
    ));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((data) => res.send(data)).catch((err) => (
  err.name === 'CastError'
    ? res.status(400).send({ message: 'Карточка не найдена' })
    : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((data) => res.send(data)).catch((err) => (
  err.name === 'CastError'
    ? res.status(400).send({ message: 'Карточка не найдена' })
    : res.status(500).send({ message: `Произошла ошибка: ${err.message}` })
));
