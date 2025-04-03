const indexRouter = require("express").Router();
const {
  getDashboard,
  postBlog,
} = require("../controllers/dashboardController");

indexRouter.get("/", getDashboard);
//TODO: set a rate limitor for blogs
indexRouter.post("/blog", postBlog);

module.exports = indexRouter;
