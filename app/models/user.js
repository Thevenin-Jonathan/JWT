const db = require("../database/db");
const bcrypt = require("bcrypt");

module.exports = class User {
  constructor(firstname, lastname, email, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }  

  async hashPassword(password) {
    const salt = 12;
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  async create() {
    const sql = `
      INSERT INTO user (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)`;
    this.password = await this.hashPassword(this.password);
    const params = [ this.firstname, this.lastname, this.email, this.password ];
    return new Promise((resolve, reject) => {
      db.run(sql, params, err => {
        if (err) return reject(err);
        return resolve(this);
      });
    });
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

  static findByEmail(email) {
    const sql = `SELECT * FROM user WHERE user.email = $1;`;
    const params = [ email ];
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
