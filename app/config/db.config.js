const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbName = path.join(__dirname, "..", "database", "app.db");

module.exports = new sqlite3.Database(dbName, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Success connexion to the DB "app.db"`);
})