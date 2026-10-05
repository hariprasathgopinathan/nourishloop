const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    // Only log essential info in production, without exposing full stack
    console.error(`[Error] ${status}: ${err.message}`);
  }

  res.status(status).json({
    success: false,
    message: status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : (err.message || 'Server Error'),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
