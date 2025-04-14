const {
  getBook,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  addOrDeleteF,
} = require("../services/bookService");
const upload = require("../middlewares/imagesMiddlewares");

const express = require('express');
const {
  getBookValidator,
  updateBookValidator,
  deleteBookValidator,
  creatBookValidator,
} = require("../utils/validators/bookValidator");
const authService = require('../services/authService');
 
const router = express.Router();
 
router.post(
  "/",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  upload.single("coverImage"),

  createBook
);

router.get('/',getAllBooks);
router.put("/addOrDeleteFavorite",authService.protect, deleteBookValidator, addOrDeleteF("favorite"));


router.put( 
  "/addOrDeleteEnCours",
  authService.protect,
  deleteBookValidator,
  addOrDeleteF("enCours")
);


router.put(
  "/addOrDeletelu",
  authService.protect,
  deleteBookValidator,
  addOrDeleteF("lu")
);

router.get('/:id',getBookValidator,getBook);


router.put(
  "/:id",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  updateBookValidator,
  upload.single("coverImage"),
  updateBook
);


router.delete("/:id",authService.protect,
  authService.allowedTo("admin", "manager"),
   deleteBookValidator, deleteBook);



module.exports = router;