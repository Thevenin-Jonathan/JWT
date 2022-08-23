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

  const user = new User(firstname, lastname, email, password);
  await user.create();

  res.render("signin", { successMessage: "Compte créé, veulliez vous connecter." });
};

exports.getSigninPage = (_, res) => {
  res.render("signin");
};

exports.signin = async (req, res) => {

};