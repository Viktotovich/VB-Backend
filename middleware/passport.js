const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const db = require("../db");
const auth = require("./auth");
require("dotenv").config();

//JWT RELATED
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//JWT
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
opts.issuer = process.env.ISSUER;
opts.audience = process.env.AUDIENCE;

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

const jwtstrategy = new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: jwt_payload.id,
      },
    });

    if (!user) {
      return done(null, false, { message: "Unauthorized" });
    } else if (user) {
      return done(null, user);
    }
  } catch (err) {
    return done(err, false, { message: "Unauthorized" });
  }
});

passport.use(strategy);
passport.use(jwtstrategy);
//Removed serialize and deserialize user since we're going to use JWT
//In JWT, the data that we serialize/deserialize anyways is stored on Local Storage
