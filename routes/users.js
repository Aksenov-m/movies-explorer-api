// создадим express router
const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();

const {
  updateUser,
  getCurrentUser,
} = require('../controllers/users'); // импортируем user контроллеры

userRouter.get('/users/me', getCurrentUser); // возвращает информацию о пользователе

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser); // обновляет информацию о пользователе (email и имя)

// экспортируем его
module.exports = userRouter;
