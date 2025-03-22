const indexRouter = require("express").Router();
const {
  getDashboard,
  postLogin,
} = require("../controllers/dashboardController");

indexRouter.get("/", getDashboard);
indexRouter.get("/login", postLogin);

module.exports = indexRouter;
