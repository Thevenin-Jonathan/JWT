const router = require("express").Router();
const {
  emailVerificationPage,
  logout,
  lostPassword,
  lostPasswordPage,
  profilePage,
  resetPasswordPage,
  resetPassword,
  sendEmailVerification,
  signin,
  signinPage,
  signup,
  signupPage,
} = require("../controllers/userController");

router.route("/signup")
  .get(signupPage)
  .post(signup);

router.route("/signin")
  .get(signinPage)
  .post(signin);

router.get("/logout", logout);

router.route("/lost-password")
  .get(lostPasswordPage)
  .post(lostPassword);

router.get("/sending-email-verification/:userId", sendEmailVerification);

router.get("/email-verification/:userId/:userEmailToken", emailVerificationPage);

router.get("/profile", profilePage);


module.exports = router;