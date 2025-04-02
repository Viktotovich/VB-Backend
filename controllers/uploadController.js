const db = require("../db");
const multer = require("multer");

module.exports.postUpload = (req, res) => {
  res.json({ message: "fake success message", err: null });
};

/* TODOS: configure cloudinary, complete this function, and create a new File model that cascade with blog / user deletion

async function processSubmitFile(req, res) {
    const {originalname, encoding, mimetype, path, size} = req.file

}

*/
