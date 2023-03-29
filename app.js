const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

const app = express();

app.use(express.static(path.join((__dirname, 'public'))));
app.use(bodyParser.json());

app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

app.use((req, res, next) => {
  req.user = {
    _id: '64231a2b0289da196b06388a',
  };

  next();
});
