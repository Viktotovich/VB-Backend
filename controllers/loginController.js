const auth = require("../middleware/auth");

//Looks like an unecessary wrapper, BUT it's super important:
//It helps separate the logic and keep things SOLID
module.exports.postLogin = (req, res, next) => {
  auth.authenticate(req, res, next);
};
