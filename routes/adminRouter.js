const indexRouter = require("express").Router();
const { getAdminPage } = require("../controllers/adminController");

indexRouter.get("/", getAdminPage);

module.exports = indexRouter;
