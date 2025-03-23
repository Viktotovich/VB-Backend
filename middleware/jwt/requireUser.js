module.exports.requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Invalid Session" });
  }

  return next();
};
