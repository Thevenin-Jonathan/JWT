const User = require("../models/user");

exports.getSignupPage = (req, res) => {
  if (req.user) return res.redirect("/profile");
  res.render("signup");
};

exports.signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  
  // Verify if user already exist
  if (await User.findByEmail(email.toString())) {
    const errMessage = "Cet email est déjà utilisé.";
    res.status(400).render("signup", { errMessage });
  }

  // Create user and add him to the DB
  const user = new User(firstname, lastname, email, password);
  await user.create();

  res.render("signin", { successMessage: "Compte créé, veulliez vous connecter." });
};

exports.getSigninPage = (req, res) => {
  if (req.user) return res.redirect("/profile");
  res.render("signin");
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Get user from DB
    const user = await User.findByEmail(email);
    // If exist, compare password, if match, log in the user, if not, display an error message
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        return res.redirect("/");
      } else {
        return res.status(400).render("signin", { errMessage: "Mot de passe erroné." });
      }
    } else {
      return res.status(404).render("signin", { errMessage: "Utilisateur non trouvé." });
    }
  // In case of error, remove token from cookie and redirect to home 
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};