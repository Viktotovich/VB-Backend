const db = require("../db");
const utils = require("./utils");
require("dotenv").config();

module.exports.verifyCallback = async (username, password, done) => {
  console.log("woo");
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return done(null, false, {
        message: "Username or Password is incorrect.",
      });
    }

    const isValid = await utils.validatePassword(password, user.hash);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: "Username or Password is incorrect.",
      });
    }
  } catch (err) {
    return done(err);
  }
};

//instead of serialize and desialize, authorize through JWT Refresh tokens
