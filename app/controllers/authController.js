const bcrypt = require("bcrypt");
const { findByEmail } = require("../models/user");
const User = require("../models/user");

exports.getSignupPage = (_, res) => {
  res.render("signup");
};

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  
  if (await User.findByEmail(email.toString())) {
    const errMessage = "Cet email est déjà utilisé.";
    res.status(400).render("signup", { errMessage });
  }

  const salt = 12;
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User(firstname, lastname, email, hashedPassword);
  await user.create();

  res.render("signin");
};

exports.getSigninPage = (_, res) => {
  res.render("signin");
};

exports.signin = async (req, res) => {

};