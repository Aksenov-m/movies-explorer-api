const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
