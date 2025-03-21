const db = require("../db");
const auth = require("../auth/auth");

module.exports.getAdminPage = (req, res) => {
  res.json({ message: "success" });
};

module.exports.postLogin = (req, res) => {
  const { username, password } = req.body;
};
