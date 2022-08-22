const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, secret);
      const user = await User.findOne(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.redirect("/");
      }
    } catch (err) {
      res.clearCookie("jwt");
      res.redirect("/");
    }
  } else {
    next();
  }
}