const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const ErrorCode = require('./error');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const urlValidate = require('./utils/urlValidate');
const NotFound = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlValidate),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ErrorCode.SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ErrorCode.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
