const { body } = require("express-validator");
const validatorMiddleware =require("../../middlewares/validatorMiddlewares");
const validateUserRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Le nom d’utilisateur est requis.")
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Le nom d’utilisateur doit contenir entre 3 et 30 caractères."
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("L’email est requis.")
    .isEmail()
    .withMessage("L’email doit être valide."),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères."),

  body("bio")
    .optional()
    .isLength({ max: 250 })
    .withMessage("La bio ne doit pas dépasser 250 caractères."),

  body("profilePicture")
    .optional()
    .isURL()
    .withMessage("L’URL de la photo de profil doit être valide."),

  body("role")
    .optional()
    .isIn(["user", "manager", "admin"])
    .withMessage('Le rôle doit être "user", "manager" ou "admin".'),
  validatorMiddleware,
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L’email est requis.")
    .isEmail()
    .withMessage("L’email doit être valide."),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
  validatorMiddleware,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
