require("dotenv").config();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const tokenExpirationInSec = 60 * 60 * 24; // Token life time (24 heures)
const tokenRefreshDelayInSec = 60 * 60 * 24 * 30; // Max time to refresh token after its expiration (30 jours)

exports.createJwt = ({ user = null, id = null, isRefreshed = 0}) => {
  const token = jwt.sign({
      sub: id || user.id.toString(),
      isRefreshed
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
  // If token is expired, verify is user staying connected is true and if the delay to refresh token is expired
  } else if (token.isRefreshed === 1 && expiration < now && now - expiration <= tokenRefreshDelayInSec) {
    // Create new token, update cookie and return the new decoded token
    const refreshedToken = this.createJwt({ id: token.sub, isRefreshed: 1 });
    res.cookie("jwt", refreshedToken);
    return jwt.decode(refreshedToken);
  } else {
    // If yes, throw an expired error
    throw new Error("Token expired.");
  }
};