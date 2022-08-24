const db = require("./db");

const createUserTable = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`;

db.run(createUserTable, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Success "user" table creation.`);
});