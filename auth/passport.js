const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const db = require("../db");
const auth = require("./auth");

const verifyCallback = async (username, password, done) => {
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

    const isValid = await auth.validatePassword(password, user.hash);

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

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

//Removed serialize and deserialize user since we're going to use JWT
//In JWT, the data that we serialize/deserialize anyways is stored on Local Storage
