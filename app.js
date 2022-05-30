const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandling = require('./middlewares/errorHandling');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/limiter');
const routers = require('./routes');
const { MONGO_URL } = require('./utils/config');

// Слушаем 3000 портex
const { PORT = 3000 } = process.env;

const app = express(); // точку входа

app.use(cors);
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // подключаем лимитер
app.use(helmet());
app.use(express.json()); // для собирания JSON-формата
app.use(routers);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandling);
// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
