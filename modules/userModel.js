const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide."],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      maxlength: 250,
      default:""
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile-picture.png",
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    lus: [
      {
         type: mongoose.Schema.ObjectId, ref: "Book" 
      },
    ],
    enCours: [
      {
        book: { type: mongoose.Schema.ObjectId, ref: "Book" },
        pagesLues: { type: Number, default: 0 },
      },
    ],

    favorite: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);







module.exports =User;
