const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const { capitalize } = require("../utils");

module.exports = class User {
  constructor(firstname, lastname, email, password, id = null) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.id = id;
  }

  get firstname() {
    return capitalize(this._firstname);
  };

  set firstname(newFirstname) {
    this._firstname = newFirstname;
  };

  get lastname() {
    return capitalize(this._lastname);
  };

  set lastname(newLastname) {
    this._lastname = newLastname;
  };

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

  static async findOne(id) {
    const sql = `SELECT * FROM user WHERE user.id = $1;`;
    const params = [ id ];
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        if (row) resolve(new User(row.firstname, row.lastname, row.email, row.password, row.id));
        else resolve(null);
      });
    });
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM user WHERE user.email = $1;`;
    const params = [ email ];
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        if (row) resolve(new User(row.firstname, row.lastname, row.email, row.password, row.id));
        else resolve(null);
      });
    });
  }
}
