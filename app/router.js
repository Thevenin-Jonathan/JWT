const router = require("express").Router();
const { getSigninPage, getSignupPage, getLostPasswordPage, signin, signup, logout } = require("./controllers/authController");
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

router.get("/logout", logout);

router.get("/profile", getProfile);

router.route("/lost-password")
  .get(getLostPasswordPage);

module.exports = router;