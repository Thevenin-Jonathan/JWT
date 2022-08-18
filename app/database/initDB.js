const db = require("./db");

const createUserTable = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  );
`;

const insertUsers = `
  INSERT INTO user (id, firstname, lastname, email, password) VALUES
  (1, 'Steve', 'Rogers', 'steve.rogers@gmail.com', 'steverogers'),
  (2, 'Tony', 'Stark', 'tony.stark@gmail.com', 'tonystark'),
  (3, 'Clark', 'Kent', 'clark.kent@gmail.com', 'clarkkent');
`;

db.run(createUserTable, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Création réussie de la table "user"`);
  db.run(insertUsers, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Insertion des utilisateurs réussie`);
  })
});