const {
    createUser,getAllUsers,getUserById,updateUser,deleteUser,followOrUnfollow
}=require('../services/userService');

const {
    validateUserRegistration,
    validateUserLogin
}=require('../utils/validators/authValidator');
const upload=require("../middlewares/imagesMiddlewares");
const express = require('express');
const authService = require('../services/authService');
const router = express.Router();

router.post(
  "/",
  authService.protect,
  authService.allowedTo("admin"),
  upload.single("profilePicture"),
  validateUserRegistration,
  createUser
);

router.get('/',authService.protect,authService.allowedTo('admin'),getAllUsers);

router.get('/:id',getUserById);

router.put('/:id',authService.protect,upload.single("profilePicture"),updateUser);
router.put('/follow/:id',authService.protect,followOrUnfollow("follow"));

router.put("/unfollow/:id", authService.protect, followOrUnfollow("unfollow"));

router.delete('/:id',authService.protect,deleteUser);

module.exports = router;