const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String, // имя это строка
    required: true, // обязательное поле
  },
  nameEN: {
    type: String, // имя это строка
    required: true, // обязательное поле
  },
  movieId: {
    type: Number, //  id фильма это число
    required: true, // обязательное поле
  },
  owner: {
    type: mongoose.Types.ObjectId, // ссылка на модель пользователя фильма
    required: true, // обязательное поле
    ref: 'user',
  },
  thumbnail: {
    type: String, // миниатюрное изображение постера к фильму — это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => { validator.isURL(v); },
      message: 'Не верный формат',
    },
  },
  trailerLink: {
    type: String, // ссылка на трейлер фильма — это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => { validator.isURL(v); },
      message: 'Не верный формат',
    },
  },
  image: {
    type: String, // ссылка на постер к фильму — это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => { validator.isURL(v); },
      message: 'Не верный формат',
    },
  },
  description: {
    type: String, // описание фильма — это строка
    required: true, // обязательное поле
  },
  year: {
    type: String, // год выпуска фильма — это строка
    required: true, // обязательное поле
  },
  duration: {
    type: Number, //  длительность фильма - это число
    required: true, // обязательное поле
  },
  director: {
    type: String, // режиссёр фильма — это строка
    required: true, // обязательное поле
  },
  country: {
    type: String, // страна создания фильма — это строка
    required: true, // обязательное поле
  },
});
// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
