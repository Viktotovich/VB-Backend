module.exports.requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Invalid Session" });
  }

  return next();
};

/* IMPLEMENT WITH CACHE ONLY!
  -This improves security, but might eat up your db


  const db = require("../../db");

module.exports.requireUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Invalid Session" });
  }

  //My gut instincts felt like someone might try to attach a fake user
  const isRealUser = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!isRealUser) {
    return res.status(403).json({ message: "Bonk, fake user" });
  }

  return next();
};
*/
