const db = require("../db");
const auth = require("../middleware/auth");

module.exports.getDashboard = (req, res) => {
  res.json({ message: "success" });
};

module.exports.postLogin = (req, res) => {
  const { username, password } = req.body;
};
