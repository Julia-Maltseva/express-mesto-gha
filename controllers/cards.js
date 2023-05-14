const Card = require('../models/card');
const ErrorCode = require('../error');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(ErrorCode.STATUS_OK).send(cards))
    .catch(() => {
      next();
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(ErrorCode.STATUS_OK).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные карточки ${error}`));
        return;
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      } if (req.user._id !== card.owner._id.toHexString()) {
        next(new Forbidden('Невозможно удалить карточку другого пользователя'));
      } else {
        res.status(ErrorCode.STATUS_OK).send({ message: 'Карточка удалена' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные карточки'));
        return;
      }
      next(error);
    });
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.status(ErrorCode.STATUS_OK).send(card);
      } else {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные карточки'));
        return;
      }
      next(error);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.status(ErrorCode.STATUS_OK).send(card);
      } else {
        next(new NotFound('Запрашиваемая карточка не найдена'));
      }
    })
    .catch((cardId) => {
      if (cardId !== req.user._id) {
        next(new BadRequest('Переданы некорректные данные карточки'));
        return;
      }
      next();
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
