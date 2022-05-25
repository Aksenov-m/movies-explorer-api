require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, errors, Joi } = require('celebrate');
const userRouter = require('./routes/users'); // импортируем роутер user
const cardRouter = require('./routes/cards'); // импортируем роутер Card
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const regex = require('./utils/utils');
const errorHandling = require('./middlewares/errorHandling');
const cors = require('./middlewares/cors');

const {
  login,
  createUser,
} = require('./controllers/users'); // импортируем user контроллеры

// Слушаем 3000 портex
const { PORT = 3000 } = process.env;

const app = express();
app.use(cors);
app.use(requestLogger); // подключаем логгер запросов
app.use(express.json()); // для собирания JSON-формата
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);
app.use(cardRouter); // запускаем Card
app.use(userRouter); // запускаем user
app.use((req, res, next) => {
  next(new NotFoundError('Роутер не найден!'));
});
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandling);
app.use(helmet());
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});