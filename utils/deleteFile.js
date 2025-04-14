const fs = require("fs");
const ApiError = require('./apiError');
exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Erreur lors de la suppression du fichier : ${err}`);
    } else {
      console.log("Fichier supprimé avec succès.");
    }
  });
};
