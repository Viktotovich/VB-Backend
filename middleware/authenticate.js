const db = require("../db");
const utils = require("./utils");
require("dotenv").config();

module.exports.verifyCallback = async (username, password, done) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return {
        error: null,
        user: false,
        message: "Username or Password is incorrect.",
      };
    }

    const isValid = await utils.validatePassword(password, user.hash);

    if (isValid) {
      return { error: null, user: user, message: "Success" };
    } else {
      return {
        error: null,
        user: false,
        message: "Username or password is incorrect.",
      };
    }
  } catch (err) {
    return done(err);
  }
};

//instead of serialize and desialize, authorize through JWT Refresh tokens
