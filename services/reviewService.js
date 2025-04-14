const Review = require("../modules/reviewModel");
const Book = require("../modules/bookModel");
const User = require("../modules/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const apiFeatures = require("../utils/apiFeatures");


exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;

  const book=await Book.findById(bookId);
  const features = new apiFeatures(Review.find({ book: bookId }), req.query).paginate(book.reviews.length);
  const {mongooseQuery,paginationResult}=features;
  const reviews = await mongooseQuery;

  res.status(200).json({
    success: true,
    results: reviews.length,
    paginationResult,
    data: reviews,
  });
});






exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }
  res.json(review);
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const { bookId, comment, rating, pagesLues } = req.body;
  const userId = req.user._id;

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ApiError("Livre introuvable", 404));
  }

  const existingReview = await Review.findOne({ user: userId, book: bookId });
  if (existingReview) {
    return next(
      new ApiError(
        "L'utilisateur a déjà laissé une critique pour ce livre",
        400
      )
    );
  }

 const review = await Review.create({
   user: userId,
   book: bookId,
   comment,
   rating,
   pagesLues, 
 });


  book.reviews.push(review._id);
  await book.updateAverageRating();  

  const user = await User.findById(userId);

  const enCoursEntry = user.enCours.find(
    (entry) => entry.book.toString() === bookId
  );

  if (parseInt(pagesLues) === book.nbrPage) {
    if (enCoursEntry) {
      user.enCours = user.enCours.filter(
        (entry) => entry.book.toString() !== bookId
      );
    }

    if (!user.lus.includes(bookId)) {
      user.lus.push(bookId);
    }
      await user.save();

  }


  res.status(201).json(review);
});



exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("Unauthorized to update this review", 401));
  }

  review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  review.updatedAt = Date.now();
  await review.save();

  const book = await Book.findById(review.book);
  await book.updateAverageRating();

  if (req.body.pagesLues !== undefined) {
    const pagesLues = req.body.pagesLues;
    const userId = req.user._id;

    if (pagesLues < book.nbrPage) {

      await User.findByIdAndUpdate(userId, {
        $addToSet: { enCours: { book: book._id, pagesLues } },
        $pull: { lus: book._id },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { lus: book._id },
        $pull: { enCours: { book: book._id, pagesLues } },
      });
    }
  }

  res.json(review);
});


exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("Unauthorized to delete this review", 401));
  }

  const book = await Book.findByIdAndUpdate(
    review.book,
    { $pull: { reviews: req.params.reviewId } },
    { new: true }
  );
  book.updateAverageRating();

  review = await Review.findByIdAndDelete(req.params.reviewId);



  res.json({ message: "Review deleted successfully" });
});
