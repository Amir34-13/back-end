const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require("../services/reviewService");
const {reviewValidator} =require('../utils/validators/reviewValidator');
const authService = require('../services/authService');
const express = require('express');
const router = express.Router();

router.get('/:bookId',getAllReviews);

router.get('/:id',getReview);
 
router.post('/',authService.protect,createReview);
router.put('/:reviewId',authService.protect,updateReview);
router.delete('/:reviewId',authService.protect,deleteReview);

module.exports = router;