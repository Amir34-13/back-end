const { validationResult } = require("express-validator");
const fs = require("fs"); 
const path = require("path");


const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     if (req.file) {
       
       const filePath = path.join(__dirname, "../uploads/", req.file.filename);
       fs.unlink(filePath, (err) => {
         if (err) {
           console.error("Erreur lors de la suppression du fichier :", err);
         }else{
           console.log("Fichier supprimé avec succès.");
         }
       });
     }

    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;

