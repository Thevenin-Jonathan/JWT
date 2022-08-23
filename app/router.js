const router = require("express").Router();
const { getSigninPage, getSignupPage, signup, signin } = require("./controllers/authController");
const { getProfile } = require("./controllers/userController");

router.get("/", (req, res) => {
  if (req.user) return res.render("index", { user: req.user });
  res.render("index");
});

router.route("/signup")
  .get(getSignupPage)
  .post(signup);

router.route("/signin")
  .get(getSigninPage)
  .post(signin);

router.get("/profile", getProfile);

module.exports = router;