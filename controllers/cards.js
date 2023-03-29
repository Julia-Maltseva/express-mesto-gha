const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Error validating user ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card !== null) {
        res.status(200).send(card);
      } else {
        res.status(400).send({ message: 'Error delete card' });
      }
    })
    .catch((error) => {
      if (error.name === 'DeleteError') {
        res.status(400).send({ message: `Error delete card ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
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
        res.status(200).send(card);
      } else {
        res.status(400).send({ message: 'Error like card' });
      }
    })
    .catch((error) => {
      if (error.name === 'LikeError') {
        res.status(400).send({ message: `Error like card ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
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
        res.status(200).send(card);
      } else {
        res.status(400).send({ message: 'Error like card' });
      }
    })
    .catch((error) => {
      if (error.name === 'LikeError') {
        res.status(400).send({ message: `Error like card ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
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
