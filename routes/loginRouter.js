const loginRouter = require("express").Router();
const { postLogin } = require("../controllers/loginController");

loginRouter.post("/", postLogin);

module.exports = loginRouter;
