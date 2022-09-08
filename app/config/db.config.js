const path = require("path");
let dbName = path.join(__dirname, "..", "database", "app.db");
let options = {};

if (process.env.NODE_ENV === "development") {
  options = { verbose: console.log };
} else if (process.env.NODE_ENV === "test") {
  dbName = path.join(__dirname, "..", "database", "app.test.db");
}

// export database connection
module.exports = require('better-sqlite3')(dbName, options);