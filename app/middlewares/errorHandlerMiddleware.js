const logger = require("../config/winston.config");

module.exports = (err, _, res, __) => {
  logger.error(err);
  res.status(500).render("error-500");
};