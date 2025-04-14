const multer = require("multer");
const path = require("path");
const apiError = require('../utils/apiError');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new apiError("Fichier non supporté. Veuillez télécharger une image.",400),
      false
    );
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
