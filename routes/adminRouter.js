const indexRouter = require("express").Router();
const { getAdminPage, postLogin } = require("../controllers/adminController");

indexRouter.get("/", getAdminPage);
indexRouter.get("/login", postLogin);

module.exports = indexRouter;
