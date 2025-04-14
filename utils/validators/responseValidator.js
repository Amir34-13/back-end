const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddlewares");

exports.addResponseValidator = [
  check("comment")
    .trim()
    .notEmpty()
    .withMessage("Le commentaire est requis.")
    .isLength({ max: 200 })
    .withMessage("Le commentaire ne doit pas dépasser 200 caractères."),
  check("reviewId").isMongoId().withMessage("Invalid response ID format."),
  validatorMiddleware,
];

exports.updateResponseValidator = [
  check("newComment")
    .trim()
    .notEmpty()
    .withMessage("Le nouveau commentaire est requis.")
    .isLength({ max: 200 })
    .withMessage("Le nouveau commentaire ne doit pas dépasser 200 caractères."),
  check("responseId").isMongoId().withMessage("Invalid response ID format."),
  check("reviewId").isMongoId().withMessage("Invalid review ID format."),
  validatorMiddleware,
];

exports.deleteResponseValidator = [
  check("responseId").isMongoId().withMessage("Invalid response ID format."),
  check("reviewId").isMongoId().withMessage("Invalid review ID format."),
  validatorMiddleware,
];

exports.getResponsesValidator = [
  check("reviewId").isMongoId().withMessage("Invalid review ID format."),
  validatorMiddleware,
];