const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCode = require('../errors');

const { JWT_SECRET } = process.env;

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  const hash = bcrypt.hash(password, 10);
  return User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => res.status(ErrorCode.STATUS_OK).send({ data: user }))
    .catch((error) => {
      if (error.code === 11000) {
        res.status(ErrorCode.CONFLICT).send({ message: 'Пользователь с такими данными уже существует' });
      }
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUserId = (req, res) => {
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
    .catch(() => {
      res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя ${error}` });
        return;
      }
      res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
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
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя ${error}` });
        return;
      }
      res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail(() => res.status(ErrorCode.NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(ErrorCode.NOT_FOUND).send({ message: 'Пользователь не найден' });
    }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 }).send({ user, token });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ErrorCode.BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя ${error}` });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send(user);
      } else {
        res.status(ErrorCode.NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'Validation Error') {
        res.status(ErrorCode.BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(ErrorCode.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  createUser,
  getUserId,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getUser,
};
