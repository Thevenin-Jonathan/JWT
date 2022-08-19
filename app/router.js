const router = require("express").Router();
const {} = require("./controllers/authController");
const { getProfile } = require("./controllers/userController");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/profile", getProfile);

module.exports = router;