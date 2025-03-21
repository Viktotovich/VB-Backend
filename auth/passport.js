const LocalStrategy = require("passport-local");
const passport = require("passport");
const db = require("../db");
const auth = require("./auth");

const verifyCallback = async (username, password, done) => {
  const user = await db.user.findUniqueOrThrow({
    where: {
      username: username,
    },
  });

  if (!user) {
    return done(null, false);
  }

  const isValid = await auth.validatePassword(password, user.hash);

  if (isValid) {
    return done(null, user);
  } else {
    return done(null, false);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
