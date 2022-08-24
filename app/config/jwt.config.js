require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const tokenExpirationInSec = 60; // Token life time
const tokenRefreshDelayInSec = 60 * 5; // Max time to refresh token after its expiration

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

  // Verify if token is expired, if not, return the same token
  if (expiration >= now) {
    return token;

  // If token is expired, verify if the delay to refresh token is expired
  } else if (expiration <= now && now - expiration <= tokenRefreshDelayInSec) {
    // If not, create new token, update cookie and return the new decoded token
    const refreshedToken = this.createJwt({ id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.decode(refreshedToken);
  } else {
    // If yes, throw an expired error
    throw new Error("Token expired");
  }
};