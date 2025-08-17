// Only express stuff here, mate.
const express = require('express');
const morgan = require('morgan');

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
  // res.status(404).json({ // handling unhandles routes
  //   status: 'fail',
  //   message: `Couldn't find ${req.originalUrl} on this server!`
  // })
  const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err); //when next() function recieves an argument, no matter what it is, express will know that there was an error
})

// error handler middleware
app.use((err, req, res, next) => { // when a middleware gets 4 parameters, express automatically recognizes it as an error middleware
  err.statusCode = err.statusCode || 500; //check if the error's status code is defined and then displays it, if not, the status code might be 500, which stands for internal server error
  err.status = err.status || 'error'; //same as the status code, but for the status

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
