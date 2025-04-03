const cloudinary = require("cloudinary").v2;
require("dotenv").config();

//https://cloudinary.com/documentation/node_quickstart
//But actually re-made version of
//https://github.com/Viktotovich/FC-Drive/blob/main/cloudinary/cloudinary.js
const { CLOUDINARY_URL } = process.env;

cloudinary.config({
  cloudinary_url: CLOUDINARY_URL,
  secure: true,
  resource_type: "auto",
});

cloudinary.config();

module.exports.uploadAsset = async (imagePath, res) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "auto",
    access_mode: "public",
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (err) {
    console.error(err);
    //Intrinsic error handler to make it easier
    res.json({ message: "Action Failed", error: err });
  }
};

//TODO: Schedule to destory temporary assets every other week
module.exports.destroyAsset = async (path) => {
  await cloudinary.uploader.destroy(path);
};
