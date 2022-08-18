require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const router = require("./app/router");
const notFoundMiddleware = require("./app/middleware/notFoundMiddleware");

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

app.use(router);

app.use(notFoundMiddleware);

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`Server started ! (http://localhost:${PORT})`);
})