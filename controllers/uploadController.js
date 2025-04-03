const db = require("../db");
const multer = require("multer");
const cloud = require("../cloud/cloudinary");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed!"));
    }

    return cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

const upload = multer({ storage: storage });

module.exports.postUpload = [upload.single("image"), processSubmitFile];

async function processSubmitFile(req, res) {
  //Yes yes we have require user, but I want to make EXTRA sure
  if (!req.user) {
    res.send(401).json({ error: "Must be logged-in to upload files" });
  }

  const { originalname, encoding, mimetype, path, size } = req.file;
  const ownerId = req.user.id;

  const { url, public_id } = await cloud.uploadAsset(path);

  console.log(url, public_id);

  try {
    await db.file.create({
      data: {
        name: originalname,
        size: size,
        path: url,
        publicId: public_id,
        encoding: encoding,
        mimetype: mimetype,
        ownerId: ownerId,
      },
    });

    res.json({ message: "success", href: url });
  } catch (err) {
    console.error(err);
    res.json({ message: "Image upload failed", error: err });
  }
}
