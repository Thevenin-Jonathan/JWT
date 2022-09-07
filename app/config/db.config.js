const path = require("path");
const dbName = path.join(__dirname, "..", "database", "app.db");
let options = {};
if (process.env.NODE_ENV !== "production") {
  options = { verbose: console.log };
}

// export database connection
module.exports = require('better-sqlite3')(dbName, options);