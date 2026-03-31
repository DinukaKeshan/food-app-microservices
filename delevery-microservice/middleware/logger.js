'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// Stream morgan logs through Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip: (req) => req.url === '/health' || req.url === '/metrics',
  }
);

module.exports = morganMiddleware;
