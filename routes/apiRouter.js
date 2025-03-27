const apiRouter = require("express").Router();
const {
  postLogin,
  getSessionHandler,
  deleteSessionHandler,
  postRegister,
} = require("../controllers/apiController");
const { requireUser } = require("../middleware/jwt/requireUser");
const loginLimiter = require("../validators/rateLimitor");
const { validateSignUp, validateSignIn } = require("../validators/validators");

apiRouter.delete("/", requireUser, deleteSessionHandler);
apiRouter.get("/", requireUser, getSessionHandler);

apiRouter.post("/", /*loginLimiter,*/ validateSignIn, postLogin);
apiRouter.post("/register", validateSignUp, postRegister);

module.exports = apiRouter;
