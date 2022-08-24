require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const tokenExpirationInSec = 60;
const tokenRefreshDelayInSec = 60 * 5;

exports.createJwt = ({ user = null, id = null }) => {
  const token = jwt.sign({
      sub: id || user.id.toString()
    },
    secret, {
      expiresIn: tokenExpirationInSec
    }
  );
  return token;
};

exports.checkExpirationToken = (token, res) => {
  const expiration = token.exp;
  const now = Math.floor(Date.now() / 1000);
  if (expiration >= now) {
    return token;
  } else if (expiration <= now && now - expiration <= tokenRefreshDelayInSec) {
    const refreshedToken = this.createJwt({ id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.decode(refreshedToken);
  } else {
    throw new Error("Token expired");
  }
};