const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const ErrorCode = require('./errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const app = express();

app.post('/signin', login);
app.post('/signup', createUser);

app.use(express.static(path.join((__dirname, 'public'))));
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => res.status(ErrorCode.NOT_FOUND).send({ message: 'Страница не найдена' }));

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
