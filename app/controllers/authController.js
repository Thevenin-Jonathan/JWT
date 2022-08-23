const User = require("../models/user");

exports.getSignupPage = (req, res) => {
  if (req.user) return res.redirect("/profile");
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

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect("/");
      } else {
        res.render("signin", { errMessage: "Mot de passe erroné." });
      }
    } else {
      res.render("signin", { errMessage: "Utilisateur non trouvé." });
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};