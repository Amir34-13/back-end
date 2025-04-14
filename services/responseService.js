const Review = require("../modules/reviewModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");

exports.getAllResponses = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;

  // Vérifier si la review existe
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedReplies = review.replies.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    results: paginatedReplies.length,
    totalResults: review.replies.length,
    currentPage: page,
    totalPages: Math.ceil(review.replies.length / limit),
    data: paginatedReplies,
  });
});


// Ajouter une réponse à une review
exports.addResponseToReview = asyncHandler(async (req, res, next) => {
  const { reviewId, comment } = req.body;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  review.replies.push({
    user: userId,
    comment: comment,
  });

  await review.save();
  res.status(201).json({ message: "Response added successfully!" });
});


// Mettre à jour une réponse
exports.updateResponse = asyncHandler(async (req, res, next) => {
  const { reviewId, responseId, newComment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  const response = review.replies.id(responseId);
  if (!response) {
    return next(new ApiError("Response not found", 404));
  }
  if (response.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("Unauthorized to update this response", 401));
  }

  response.comment = newComment;
  response.updatedAt = Date.now();
  await review.save();
  res.json({ message: "Response updated successfully!" });
});


// Supprimer une réponse
exports.deleteResponse = asyncHandler(async (req, res, next) => {
  const { reviewId, responseId } = req.body;

  let review = await Review.findById(reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  const response = review.replies.id(responseId);
  if (!response) {
    return next(new ApiError("Response not found", 404));
  }
  if (response.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("Unauthorized to delete this response", 401));
  }


  review.replies = review.replies.filter(
    (r) => r._id.toString() !== responseId
  );
  await review.save();


  res.json({ message: "Response deleted successfully!" });
});

