const User = require('../models/user');
const ErrorCode = require('../errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(ErrorCode.STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send(user);
      } else {
        res.status(ErrorCode.NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((user) => {
      if (user._id !== id) {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ErrorCode.STATUS_OK).send(users))
    .catch((error) => {
      res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send({ name: user.name, about: user.about });
      } else {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.NOT_FOUND).send({ message: `Запрашиваемый пользователь не найден ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send({ avatar: user.avatar });
      } else {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.NOT_FOUND).send({ message: `Запрашиваемый пользователь не найден ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
};
