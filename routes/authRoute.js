const express = require("express");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../utils/validators/authValidator");
const upload = require ("../middlewares/imagesMiddlewares");
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post(
  "/signup",
  upload.single("profilePicture"),
  validateUserRegistration,
  signup
);
router.post("/login", validateUserLogin, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
