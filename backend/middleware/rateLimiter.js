const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
const strictLimiter = createRateLimiter(1 * 60 * 1000, 20);

module.exports = {
  apiLimiter,
  strictLimiter,
  createRateLimiter
};