const jwt = require('jsonwebtoken');
const ErrorCode = require('../errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(ErrorCode.UNAUTHORIZED).send({ message: 'Необходимо авторизоваться' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    res.status(ErrorCode.UNAUTHORIZED).send({ message: 'Необходимо авторизоваться' });
  }

  req.user = payload;
  next();
};

module.exports = auth;
