require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const router = require("./app/routers");
const { addJwtFeatures, extractUserFromToken } = require("./app/middlewares/jwt");
const notFoundMiddleware = require("./app/middlewares/notFoundMiddleware");

// Parsing
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files handling
app.use(express.static(path.join(__dirname, "public")));

// EJS handling
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

// JWT handling
app.use(addJwtFeatures);

// routing
app.use(extractUserFromToken, router);

// 404 handling
app.use(notFoundMiddleware);

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`Server started ! (http://localhost:${PORT})`);
})