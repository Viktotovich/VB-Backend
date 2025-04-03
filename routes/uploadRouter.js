const uploadRouter = require("express").Router();
const uploadLimiter = require("../validators/uploadLimitor");
const { postUpload } = require("../controllers/uploadController");

uploadRouter.post("/", uploadLimiter, postUpload);

module.exports = uploadRouter;
