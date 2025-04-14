const Book= require("../modules/bookModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const apiFeatures=require("../utils/apiFeatures");
const User=require("../modules/userModel");
const {deleteFile}=require("../utils/deleteFile");
const path =require('path');
const Review=require("../modules/reviewModel");
exports.getBook = asyncHandler(
    async (req, res, next) => {
        const book = await Book.findById(req.params.id).populate({
          path: "reviews",
          populate: [
            { path: "user", select: "username" }, // Récupère le `name` de l'utilisateur dans reviews
            { path: "replies.user", select: "username" }, // Récupère le `name` de l'utilisateur dans replies
          ],
        });
        if (!book) {
            next( new ApiError("Book not found", 404));
        }
        res.json(book);
    } 
)
exports.getAllBooks =asyncHandler(
    async (req, res, next) => {
       const documentsCount=await Book.countDocuments();
       const features = new apiFeatures(Book.find(), req.query)
         .search()
         .filter()
         .sort()
         .paginate(documentsCount);
       const {mongooseQuery,paginationResult}=features;
       const books=await mongooseQuery;
       res.json({results:books.length,paginationResult,data:books});

    }
)

exports.createBook = asyncHandler(async (req, res, next) => {
  console.log("on est là");
    //this book is already 
    const bookExists = await Book.findOne({ title: req.body.title });
    if (bookExists) {
        return next(new ApiError("Book already exists", 400));
    }
       

    if (req.file) {
       req.body.coverImage = req.file.path;

    }
    const book = await Book.create(req.body);
  if(!book){
    next(new ApiError("fail creating book",400));
  }

  res.status(201).json(book);
  
});

exports.updateBook = asyncHandler(
    async (req, res, next) => {
      if (req.file) {
        req.body.coverImage = req.file.path;

      }
        const book = await Book.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
        if (!book) {
            next(new ApiError("Book not found", 404));
        }
        book.save();
        res.json(book);
    })
    
exports.deleteBook = asyncHandler(
    async (req, res, next) => {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            next(new ApiError("Book not found", 404));
        }
        
        if (!book) {
            next(new ApiError("Book not found", 404));
        }
        await Review.deleteMany({ book: req.params.id });
        await User.updateMany(
          {},
          {
            $pull: {
              favorite: req.params.id,
              lus: req.params.id,
              enCours: { book: req.params.id },
            },
          }
        );
        res.json({message: "Book deleted successfully"});
    })
exports.addOrDeleteF = (section) =>
  asyncHandler(async (req, res, next) => {

    const pagesLues = req.body.pagesLues || 0;
    const userId = req.user._id;

    // Récupération de l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie si l'ID est fourni
    const bookId = req.body.id;
    if (!bookId) {
      return res.status(400).json({ message: "L'ID du livre est requis" });
    }

    // Ajout ou suppression selon la section
    if (section === "favorite") {
      if (user.favorite.includes(bookId)) {
        user.favorite.pull(bookId);
      } else {
        user.favorite.push(bookId);
      }
    } else if (section === "enCours") {
      const existingEntry = user.enCours.find(
        (entry) => entry.book.toString() === bookId
      );
      if (existingEntry) {
        user.enCours = user.enCours.filter(
          (entry) => entry.book.toString() !== bookId
        );
      } else {
        user.enCours.push({ book: bookId, pagesLues });
        user.lus.pull(bookId);

      }
    } else if (section === "lu") {
      if (user.lus.includes(bookId)) {
        user.lus.pull(bookId);
      } else {
        user.enCours = user.enCours.filter(
          (entry) => entry.book.toString() !== bookId
        );
        user.lus.push(bookId);
      }
    } else {
      next(new ApiError('Section invalid',400));
    }

    // Sauvegarde de l'utilisateur
    await user.save();

    // Réponse JSON
    res.json({ message: `Livre ajouté/supprimé avec succès à/de ${section}` });
  });


