const { validateEmail } = require("validators");
const AppError = require("../Utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or unknown error: don't leak error details
  } else {
    // log the error
    console.error("ERROR!!!!", err);

    // send a generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // when a middleware gets 4 parameters, express automatically recognizes it as an error middleware
  err.statusCode = err.statusCode || 500; //check if the error's status code is defined and then displays it, if not, the status code might be 500, which stands for internal server error
  err.status = err.status || "error"; //same as the status code, but for the status
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // creating a new object so we dont modify the original one
    let error = Object.assign(err);
    // DATABASE errors aren't naturally considered operational errors, but we of course need them to be, so this is how we do it
    // handling invalid DB IDs
    // 1 - invalid id query (castError)
    if (error.name === "CastError") error = handleCastErrorDB(error);
    // 2 - duplicate name
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // 3 - validation (invalid ratings average, for example)
    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
