require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

module.exports.createJwt = (user) => {
  const token = jwt.sign({
      sub: user.id.toString()
    },
    secret, {
      expiresIn: "30s"
    }
  );
  return token;
};
