module.exports.requireUser = (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(403);
  }

  return next();
};
