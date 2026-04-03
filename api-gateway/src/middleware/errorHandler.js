/**
 * Global error handler middleware.
 * Returns a JSON response with the error status and message.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.status || 500;

  console.error(`[Error] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
