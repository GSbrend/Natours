const AppError = require("../Utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const sendErrorProd = (err, res) => {
// operational, trusted error: send message to the client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
// programming or unknown error: don't leak error details
  } else {
// log the error
    console.error('ERROR!!!!', err);

// send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = (err, req, res, next) => { // when a middleware gets 4 parameters, express automatically recognizes it as an error middleware
  err.statusCode = err.statusCode || 500; //check if the error's status code is defined and then displays it, if not, the status code might be 500, which stands for internal server error
  err.status = err.status || 'error'; //same as the status code, but for the status
  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log("Current environment:", process.env.NODE_ENV);
    // creating a new object so we dont modify the original one
    let error = { ...err, name: err.name};
    // DATABASE errors aren't naturally considered operational errors, but we of course need them to be, so this is how we do it
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // handling invalid DB IDs
    // 1 - invalid id query (castError)
    // 2 - duplicate name
    // 3 - validation (invalid ratings average, for example)

    sendErrorProd(error, res);
  }
}