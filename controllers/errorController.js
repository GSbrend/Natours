module.exports = (err, req, res, next) => { // when a middleware gets 4 parameters, express automatically recognizes it as an error middleware
  err.statusCode = err.statusCode || 500; //check if the error's status code is defined and then displays it, if not, the status code might be 500, which stands for internal server error
  err.status = err.status || 'error'; //same as the status code, but for the status

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
}