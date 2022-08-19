const db = require("../database/db");

module.exports = class User {
  constructor(firstname, lastname, email, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  static findOne(id) {
    const sql = `SELECT * FROM user WHERE user.id = $1;`;
    const params = [ id ];
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        return resolve(row);
      });
    });
  }

  static findAll() {
    const sql = `SELECT * FROM user;`;
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }
}
