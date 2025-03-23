const { signJWT, verifyJWT } = require("../middleware/jwt/jwt.utils");

const authenticate = require("../middleware/authenticate");
const db = require("../db");
const crypto = require("node:crypto");

module.exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  //authenticate the passwords, return user
  const { user } = await authenticate.verifyCallback(username, password, next);

  //create a session
  const session = await db.session.create({
    data: {
      sessionId: crypto.randomUUID(),
      name: user.name,
    },
  });

  //if correct, assign a JWT token
  const token = signJWT({ user, sessionId: session.sessionId }, "15m");

  res.cookie("token", token, {
    maxAge: 900000,
    httpOnly: true,
    secure: true,
  });

  //and assign a JWT Refresh Token
  const refreshToken = signJWT({ sessionId: session.sessionId }, "2d");

  res.cookie("refreshToken", refreshToken, {
    maxAge: 172800000, //2 days
    httpOnly: true,
  });

  res.send(session);
};

module.exports.postLogout = async (req, res, next) => {
  const { user } = req;

  const session = await db.session.delete({
    where: {
      sessionId: user.sessionId,
    },
  });

  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  return res.send(session);
};

module.exports.getSessionHandler = (req, res) => {
  return res.send(req.user);
};
