const jwt = require("jsonwebtoken");
require("dotenv").config();

const { PUBLIC_KEY, PRIVATE_KEY } = process.env.SECRET;

//sign JWT
module.exports.signJWT = (payload, expiresIn) => {
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: "RS256" }, expiresIn);
};

//verify JWT
module.exports.verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY);
    return { payload: decoded, expired: false };
  } catch (err) {
    return { payload: null, expired: err.message.includes("jwt expired") };
  }
};
