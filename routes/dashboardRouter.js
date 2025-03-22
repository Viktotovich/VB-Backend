const indexRouter = require("express").Router();
const {
  getDashboard,
  postLogin,
} = require("../controllers/dashboardController");

indexRouter.get("/", getDashboard);

module.exports = indexRouter;
