const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2, //attempts
  message:
    "Please wait a a few minutes before uploading an image again. Thank you for your patience. This is not a bug, it's a precaution to keep our server loads low.",
});

module.exports = uploadLimiter;
