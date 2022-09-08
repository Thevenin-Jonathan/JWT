const User = require("../models/user");
const { v4: uuid } = require("uuid");
const { logger } = require("../config/winston.config");

exports.signupPage = (req, res) => {
  if (req.user) return res.redirect("/profile");
  res.render("auth/signup");
};

exports.signup = (req, res) => {
  const body = req.body;

  try {
    // Verify if user already exist
    if (User.findByEmail(body.email.toString())) {
      return res.status(400).render("auth/signup", { errMessage: "Cet email est déjà utilisé." });
    }

    // Create user and add him to the DB
    const user = User.create(body);

    // Send email verification
    user.sendEmailVerification(req.headers.host);

    return res.status(201).render("auth/signin", { successMessage: "Un email vous a été envoyé pour vérifier votre adresse." });

  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/signup", { errMessage: "Une erreur est survenue." });
  }
};

exports.signinPage = (req, res) => {
  if (req.user) return res.redirect("/profile");
  res.render("auth/signin");
};

exports.signin = (req, res) => {
  try {
    const { email, password } = req.body;
    const stayConnected = parseInt(req.body.stayConnected);
    // Get user from DB
    const user = User.findByEmail(email);
    // If exist, compare password, if match, log in the user, if not, display an error message
    if (user) {
      const match = user.comparePassword(password);
      if (match) {
        if (user.emailVerified === 0) {
          return res.status(400).render("auth/signin", {
            errMessage: "Veuillez vérifier votre adresse email.",
            url: `/users/sending-email-verification/${user.id}`
          });
        } else if (user.isBanned === 1) {
          return res.status(403).render("auth/signin", {
            errMessage: "Ce compte est banni définitivement."
          });
        } else {
          req.login(user, stayConnected);
          return res.redirect("/");
        }
      }
    }
    return res.status(404).render("auth/signin", { errMessage: "Email ou mot de passe erroné." });
    // In case of error, remove token from cookie and redirect to home 
  } catch (err) {
    logger.error(err);
    res.redirect("/");
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.profilePage = (req, res) => {
  if (req.user) return res.render("profile", { user: req.user });
  res.render("/");
};

exports.sendEmailVerification = (req, res) => {
  try {
    const { userId } = req.params;
    const user = User.findOne(userId);

    // Check if user exist and if its account is not verified
    if (user && user.emailVerified === 0) {
      // If yes, an email is sending to him for verification
      user.sendEmailVerification(req.headers.host);
      return res.render("auth/signin", { successMessage: "Un email vous a été envoyé pour vérifier votre adresse." });
    } else {
      // if not, redirect to home page
      return res.status(400).redirect("/");
    }
  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/signin", { errMessage: "Une erreur est survenue." });
  }
};

exports.emailVerificationPage = (req, res) => {
  try {
    const { userId, userEmailToken } = req.params;
    const user = User.findOne(userId);

    // Check if user exist
    if (user) {
      // Check if the user have already verified its account
      if (user.emailVerified === 1) {
        // If yes, redirect to home page
        return res.redirect("/users/signin");
        // Check if the informations about email token are right
      } else if (userEmailToken && userEmailToken === user.emailToken) {
        // If yes, change its account to verified
        user.emailVerified = 1;
        user.save();
        return res.render("auth/email-verification");
      }
    };
    return res.status(400).render("auth/email-verification", { errMessage: "Un problème est survenu durant le processus de vérification." });
  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/email-verification", { errMessage: "Une erreur est survenue." });
  }
};

exports.lostPasswordPage = (_, res) => {
  res.render("auth/lost-password");
};

exports.lostPassword = (req, res) => {
  try {
    const { email } = req.body;
    const user = User.findByEmail(email);

    // Check if user exist
    if (user) {
      // If yes, create password token and password token expiration and sending an reset password email
      user.passwordToken = uuid();
      user.passwordTokenDate = (Date.now() / 1000 / 60) + 120;
      user.save();
      user.sendEmailResetPassword(req.headers.host);
      return res.render("auth/signin", { successMessage: "Un email pour réinitialiser votre mot de passe vous a été envoyé." });
    }
    return res.status(400).render("auth/lost-password", { errMessage: "Utilisateur inconnu." });
  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/lost-password", { errMessage: "Une erreur est survenue." });
  }
}

exports.resetPasswordPage = (req, res) => {
  try {
    const { userId, passwordToken } = req.params;
    const user = User.findOne(userId);

    // Check if user exist
    if (user) {
      // If yes, check if the informations about password token are right
      if (user.passwordToken === passwordToken && user.passwordTokenDate > Date.now() / 1000 / 60) {
        return res.render("auth/reset-password", { userId, passwordToken });
      }
      return res.status(400).render("auth/signin", { errMessage: "Le lien est expiré ou corrompu." });
    }
    return res.status(400).render("auth/signin", { errMessage: "Compte utilisateur inconnu." });
  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/signin", { errMessage: "Une erreur est survenue." });
  }
};

exports.resetPassword = (req, res) => {
  try {
    const { userId, passwordToken } = req.params;
    const { password } = req.body;
    const user = User.findOne(userId);

    // Check if user exist
    if (user) {
      // If yes, check if the informations about password token are right
      if (user.passwordToken === passwordToken && user.passwordTokenDate > Date.now() / 1000 / 60) {
        // If yes, hash the new password and update the old password with it and remove password token infos
        user.password = User.hashPassword(password);
        user.passwordToken = null;
        user.passwordTokenDate = null;
        user.save();
        return res.render("auth/signin", { successMessage: "Le mot de pass a bien été réinitialisé." });
      }
      return res.status(400).render("auth/signin", { errMessage: "Le lien est expiré ou corrompu." });
    }
    return res.status(400).render("auth/signin", { errMessage: "Compte utilisateur inconnu." });
  } catch (err) {
    logger.error(err);
    res.status(400).render("auth/reset-password", { errMessage: "Une erreur est survenue." });
  }
};