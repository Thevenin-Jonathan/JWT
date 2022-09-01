const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbName = path.join(__dirname, "..", "database", "app.db");
const logger = require("../config/winston.config");

// export database connection
module.exports = new sqlite3.Database(dbName, err => {
  if (err) {
    return logger.error(err);
  }
  console.log(`Success connexion to the DB "app.db"`);
})