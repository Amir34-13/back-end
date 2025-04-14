const fs = require('fs');
const path = require('path');

// Charger le fichier JSON existant
const books = require('./livres_test_50.json');

// Dossier où seront copiées les images
const uploadsDir = path.join(__dirname, '../uploads'); // adapte le chemin selon ton projet

// Crée le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Utilise une image existante comme modèle
const placeholderPath = path.join(__dirname, 'images.jpeg'); // à remplacer par tes vraies images

books.forEach((book, index) => {
  const fileName = `cover${index + 1}.jpg`;
  const destPath = path.join(uploadsDir, fileName);

  // Copie l'image dans /uploads
  fs.copyFileSync(placeholderPath, destPath);

  // Met à jour le chemin de l'image dans le livre
  book.coverImage = `/uploads/${fileName}`;
});

// Enregistre un nouveau fichier JSON prêt à importer
fs.writeFileSync(
  path.join(__dirname, 'livres_test_50_local.json'),
  JSON.stringify(books, null, 2),
  'utf-8'
);

console.log("✅ Fichier JSON mis à jour avec images locales !");
