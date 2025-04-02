module.exports.postUpload = (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.json({ message: "fake success message", err: null });
};
