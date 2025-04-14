const path = require("path");
// const hpp = require("hpp");
const globalError=require('./middlewares/errorMiddlewares');
const ApiError = require("./utils/apiError");
const userRoute =require('./routes/userRoute');
const rateLimit = require("express-rate-limit");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const authRoute = require("./routes/authRoute");
const bookRoute=require('./routes/bookRoute');
const reviewRoute=require('./routes/reviewRoute');
const responseRoute=require('./routes/responseRoute');
const bodyParser=require('body-parser');
dotenv.config();
const dbConnection = require("./config/dbConfig");
const app = express();
const helmet = require("helmet");
const xss = require("xss-clean");

app.use(helmet()); // sécurise les headers HTTP
app.use(xss()); // empêche l'injection de code malicieux

const PORT = process.env.PORT || 3000;
dbConnection();

// Enable other domains to access your application

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://front-end-akks.onrender.com",
      "https://front-end-swart-iota.vercel.app",
    ],
  })
);

// compress all responses
app.use(compression());

// Checkout webhook
// app.post(
//   '/webhook-checkout',
//   express.raw({ type: 'application/json' }),
//   webhookCheckout
// );

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message:
//     "Too many accounts created from this IP, please try again after an hour",
// });

// // Apply the rate limiting middleware to all requests
// app.use("/api", limiter);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));

// app.use(body Parser.urlencoded({ extended: true })); 

app.use(express.urlencoded({ extended: true })); 








app.use(express.json({ limit: "20kb" }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/book", bookRoute);



app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/response", responseRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);



const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
