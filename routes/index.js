const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users'); // импортируем роутер user
const movieRouter = require('./movie'); // импортируем роутер фильмов
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const {
  login,
  createUser,
} = require('../controllers/users'); // импортируем user контроллеры

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
// авторизация
router.use(auth);
router.use(movieRouter); // запускаем Фильмы
router.use(userRouter); // запускаем user
router.use((req, res, next) => {
  next(new NotFoundError('ресурс не найден'));
});
module.exports = router;
