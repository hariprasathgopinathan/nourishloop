const rateLimit = require('express-rate-limit');

// Common options
const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

const apiLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes' }
});

const mutationLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many mutation attempts, please try again later' }
});

const notificationLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many notification requests' }
});

const heavyEndpointLimiter = rateLimit({
  ...commonOptions,
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { success: false, message: 'Too many heavy endpoint requests' }
});

module.exports = {
  apiLimiter,
  authLimiter,
  mutationLimiter,
  notificationLimiter,
  heavyEndpointLimiter
};
