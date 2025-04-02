const uploadRouter = require("express").Router();
const uploadLimiter = require("../validators/rateLimitor");
const { postUpload } = require("../controllers/uploadController");

uploadRouter.post("/", uploadLimiter, postUpload);

module.exports = uploadRouter;
