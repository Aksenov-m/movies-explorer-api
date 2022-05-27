const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const Movie = require('../models/movie');

// создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameEN,
    nameRU,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameEN,
    nameRU,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные фильма.'));
      } else {
        next(err);
      }
    });
};

// возвращает все фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next); // добавили catch
};

// удаляет фильм
const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  const owner = req.user._id;
  Movie.findById(id)
    .orFail(() => new NotFoundError('Фильм с указанным id не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(owner)) {
        return next(new ForbiddenError('Удалять чужую карточка нельзя.'));
      }
      return movie.remove()
        .then(() => res.send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
