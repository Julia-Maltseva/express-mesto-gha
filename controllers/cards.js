const Card = require('../models/card');
const ErrorCode = require('../errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ErrorCode.STATUS_OK).send(cards))
    .catch((error) => {
      res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(ErrorCode.STATUS_OK).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные карточки ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        res.status(ErrorCode.STATUS_OK).send({ card });
      } else {
        res.status(ErrorCode.NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((id) => {
      if (id !== cardId) {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.status(ErrorCode.STATUS_OK).send(card);
      } else {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      }
    })
    .catch((error) => {
      if (error.name === 'LikeError') {
        res.status(ErrorCode.NOT_FOUND).send({ message: `Запрашиваемая карточка не найдена ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.status(ErrorCode.STATUS_OK).send(card);
      } else {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      }
    })
    .catch((error) => {
      if (error.name === 'LikeError') {
        res.status(ErrorCode.NOT_FOUND).send({ message: `Запрашиваемая карточка не найдена ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
