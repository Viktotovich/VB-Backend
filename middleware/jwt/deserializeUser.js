const db = require("../../db");
const { verifyJWT, signJWT } = require("../jwt/jwt.utils");

module.exports.deserializeUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload: user, expired } = verifyJWT(accessToken);

  if (user) {
    req.user = user;

    return next();
  }

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }

  const session = await db.session.findFirst({
    where: {
      sessionId: refresh.sessionId,
    },
  });

  if (!session) {
    return next();
  }

  const newAccessToken = signJWT(session, "15m");

  res.cookie("accessToken", newAccessToken, {
    maxAge: 900000, //15m
    httpOnly: true,
  });

  req.user = verifyJWT(newAccessToken).payload;

  return next();
};
