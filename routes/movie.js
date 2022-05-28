// создадим express router
const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies'); // импортируем movie контроллеры
const regex = require('../utils/utils');

movieRouter.get('/movies', getMovies); // возвращает все сохранённые текущим  пользователем фильмы

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    thumbnail: Joi.string().required().pattern(regex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), createMovie); // создаёт фильм с переданными в теле параметрами

movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie); // удаляет фильм по идентификатору

// экспортируем его
module.exports = movieRouter;
