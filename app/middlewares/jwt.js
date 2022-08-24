const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../models/user");
const { createJwt, checkExpirationToken } = require("../config/jwt.config");

module.exports.addJwtFeatures = async (req, res, next) => {
  // Return a boolean 
  req.isAuthenticated = () => !!req.user;
  // Remove cookie for logout
  req.logout = () => res.clearCookie("jwt");
  // Create token and add it to user cookie
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
      // Verify token signature
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      // Verify token expiration
      decodedToken = checkExpirationToken(decodedToken, res);
      // Get user from DB
      const user = await User.findOne(decodedToken.sub);
      // If user exist, add him to "req.user" and pass to the next middleware
      if (user) {
        req.user = user;
        next();
      // If not, remove token from cookie and redirect to home
      } else {
        res.clearCookie("jwt");
        res.redirect("/");
      }
    // In case of error, remove token from cookie and redirect to home 
    } catch (err) {
      console.error(err);
      res.clearCookie("jwt");
      res.redirect("/");
    }
  } else {
    next();
  }
}