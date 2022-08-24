const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../models/user");
const { createJwt, checkExpirationToken } = require("../config/jwt.config");

module.exports.addJwtFeatures = async (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user) => {
    const token = createJwt({ user });
    res.cookie("jwt", token);
  };
  next();
};

module.exports.extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await User.findOne(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.redirect("/");
      }
    } catch (err) {
      console.error(err);
      res.clearCookie("jwt");
      res.redirect("/");
    }
  } else {
    next();
  }
}