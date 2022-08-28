const router = require("express").Router();
const {
  getSigninPage,
  getSignupPage,
  getLostPasswordPage,
  getProfile,
  signin,
  signup,
  logout
} = require("../controllers/userController");

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