const {
  getAllResponses,
  addResponseToReview,
  updateResponse,
  deleteResponse,
} = require("../services/responseService");

const express = require('express');
// const {
//   getBookValidator,
//   updateBookValidator,
//   deleteBookValidator,
//   creatBookValidator,
// } = require("../utils/validators/bookValidator");
const authService = require('../services/authService');
 
const router = express.Router();
 
router.get('/:reviewId',getAllResponses);

// router.get('/:id',getReview);
 
router.post('/',authService.protect,addResponseToReview);
router.put('/',authService.protect,updateResponse);
router.delete('/',authService.protect,deleteResponse);

module.exports = router;