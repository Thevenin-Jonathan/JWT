const router = require("express").Router();
const {
  getSigninPage,
  getSignupPage,
  getLostPasswordPage,
  getEmailVerificationPage,
  getProfile,
  sendEmailVerification,
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

router.route("/lost-password")
  .get(getLostPasswordPage);

router.get("/sending-email-verification/:userId", sendEmailVerification);

router.get("/email-verification/:userId/:userEmailToken", getEmailVerificationPage);

router.get("/profile", getProfile);


module.exports = router;