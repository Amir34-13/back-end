const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");

exports.reviewValidator = [
  check("comment")
    .trim()
    .notEmpty()
    .withMessage("Le commentaire est requis.")
    .isLength({ max: 200 })
    .withMessage("Le commentaire ne doit pas dépasser 1000 caractères."),

  check("rating")
    .notEmpty()
    .withMessage("La note est requise.")
    .isInt({ min: 1, max: 5 })
    .withMessage("La note doit être comprise entre 1 et 5."),
  validatorMiddleware,
];
