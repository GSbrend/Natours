// Only express stuff here, mate.
const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Log requests to the console
}

app.use(express.json()); // Parse JSON bodies (as sent)
app.use(express.static(`${__dirname}/public`)); // used to manipulate URL of static files in the folder

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// error handler
// it must be in the end of the code due to the reading order
app.all('*', (req, res, next) => { // .all stands for all methods and * stands for all urls
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404)); //when next() function recieves an argument, no matter what it is, express will know that there was an error
})

// error handler middleware
app.use(globalErrorHandler);

module.exports = app;
