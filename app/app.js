require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const router = require("./routers");
const { addJwtFeatures, extractUserFromToken } = require("./middlewares/jwt");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");

// Parsing
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files handling
app.use(express.static(path.join(__dirname, "..", "public")));

// EJS handling
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// JWT handling
app.use(addJwtFeatures);

// routing
app.use(extractUserFromToken, router);

// 404 handling
app.use(notFoundMiddleware);

// error handler
app.use(errorHandlerMiddleware)

module.exports = app;