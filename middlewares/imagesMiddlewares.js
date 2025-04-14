// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const apiError = require("../utils/apiError");

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // dossier dans Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Garde ton fileFilter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new apiError(
        "Fichier non supporté. Veuillez télécharger une image.",
        400
      ),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
