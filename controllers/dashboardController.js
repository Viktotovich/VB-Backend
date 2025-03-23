const db = require("../db");
const { verifyJWT } = require("../middleware/jwt/jwt.utils");

module.exports.getDashboard = (req, res) => {
  res.json({ message: "success" });
};
