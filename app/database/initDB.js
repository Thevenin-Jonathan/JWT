const db = require("../config/db.config");

const createUserTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email_token TEXT,
    email_verified INTEGER DEFAULT 0 NOT NULL,
    password_token TEXT,
    password_token_date TEXT,
    is_banned INTEGER DEFAULT 0 NOT NULL
  );
`);

try {
  createUserTable.run();
  console.log("User table created !");
} catch (err) {
  console.error(err);
}