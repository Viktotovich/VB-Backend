const { signJWT } = require("../middleware/jwt/jwt.utils");
const auth = require("../middleware/utils");
require("dotenv").config();

const authenticate = require("../middleware/authenticate");
const db = require("../db");
const crypto = require("node:crypto");

//validators
const { validationResult } = require("express-validator");

module.exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "failed", error: errors.array() });
  }
  const { username, password } = req.body;

  //authenticate the passwords, return user
  const { error, user } = await authenticate.verifyCallback(
    username,
    password,
    next
  );

  if (error) {
    return res.status(401).json({ message: error });
  }
  //create a session
  const session = await db.session.create({
    data: {
      sessionId: crypto.randomUUID(),
      name: user.name,
    },
  });

  //if correct, assign a JWT token
  const token = signJWT(
    { name: user.name, id: user.id, sessionId: session.sessionId },
    "15m"
  );

  res.cookie("accessToken", token, {
    maxAge: 900000,
    httpOnly: true,
    secure: process.env.ISPROD,
    sameSite: "none",
  });

  //and assign a JWT Refresh Token
  const refreshToken = signJWT({ sessionId: session.sessionId }, "2d");

  res.cookie("refreshToken", refreshToken, {
    maxAge: 172800000, //2 days
    httpOnly: true,
    secure: process.env.ISPROD,
    sameSite: "none",
  });

  res.send(session);
};

//TODO: Validate the input
//REJECT Same username or same email
module.exports.postRegister = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    console.dir(req.body, null);
    const name = firstName + " " + lastName;

    const { hash } = await auth.genPassword(password);
    await db.user.create({
      data: {
        name,
        email,
        username,
        hash,
      },
    });

    res.json({ message: "User successfuly registered!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.deleteSessionHandler = async (req, res, next) => {
  const { user } = req;

  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete session" });
  }
};

module.exports.getSessionHandler = (req, res) => {
  return res.send(req.user);
};
