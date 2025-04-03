const db = require("../../db");
const { verifyJWT, signJWT } = require("../jwt/jwt.utils");

module.exports.deserializeUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (accessToken) {
    try {
      const { payload: user, expired } = verifyJWT(accessToken);

      if (user) {
        req.user = user;
        return next();
      }

      if (expired && refreshToken) {
        return await handleRefreshToken(refreshToken, req, res, next);
      }
    } catch (error) {
      console.error("Access token verification failed:", error);
      res.clearCookie("accessToken");
    }
  }

  if (refreshToken) {
    return await handleRefreshToken(refreshToken, req, res, next);
  }

  return next();
};

async function handleRefreshToken(refreshToken, req, res, next) {
  try {
    const { payload: refresh } = verifyJWT(refreshToken);
    if (!refresh?.sessionId) return invalidateSession(res, next);

    const session = await db.session.findUnique({
      where: { sessionId: refresh.sessionId },
    });

    if (!session) return invalidateSession(res, next, refresh.sessionId);

    const newAccessToken = signJWT(
      { name: session.name, id: session.userId, sessionId: session.sessionId },
      "15m"
    );

    res.cookie("accessToken", newAccessToken, {
      maxAge: 900000, //15 minutes
      httpOnly: true,
      secure: false, //TODO: CHANGE TO TRUE WITH HTTPS ENABLED IN PROD
      sameSite: "lax",
    });

    req.user = { id: session.userId, name: session.name };
    return next();
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return invalidateSession(res, next);
  }
}

async function invalidateSession(res, next, sessionId = null) {
  if (sessionId) {
    await db.session.deleteMany({ where: { sessionId } });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return next();
}

/* BACKUP:

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

*/
