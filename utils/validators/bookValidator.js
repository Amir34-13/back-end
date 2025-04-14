const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");

exports.creatBookValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis.")
    .isLength({ max: 255 })
    .withMessage("Le titre ne doit pas dépasser 255 caractères."),

  check("author")
    .trim()
    .notEmpty()
    .withMessage("L’auteur est requis.")
    .isLength({ max: 255 })
    .withMessage("Le nom de l’auteur ne doit pas dépasser 255 caractères."),

  check("genre")
    .isArray({ min: 1 })
    .withMessage("Le genre doit être un tableau contenant au moins un élément.")
    .custom((genres) =>
      genres.every((g) => typeof g === "string" && g.length <= 50)
    )
    .withMessage(
      "Chaque genre doit être une chaîne de caractères de 50 caractères maximum."
    ),

  check("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La description ne doit pas dépasser 1000 caractères."),

  check("publicationDate")
    .optional()
    .isISO8601()
    .withMessage("La date de publication doit être une date valide."),

  check("coverImage")
    .optional()
    .isURL()
    .withMessage("L’URL de la couverture doit être valide."),
  validatorMiddleware,
];


exports.getBookValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
]; 

exports.updateBookValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.deleteBookValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];


