const errorHandler = (err, req, res, next) => {
  console.log('Error', err)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

module.exports = errorHandler;