const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const { capitalize } = require("../utils");
const { v4: uuid } = require("uuid");
const { Email } = require("../emails/email");

module.exports = class User {
  constructor (firstname, lastname, email, password, optionnal = {}) {
    this.id = optionnal.id || null;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.emailVerified = optionnal.emailVerified || 0;
    this.emailToken = optionnal.emailToken || uuid();
    this.passwordToken = optionnal.passwordToken || null;
    this.passwordTokenDate = optionnal.passwordTokenDate || null;
    this.isBanned = optionnal.isBanned || 0;
  }

  get firstname() {
    return capitalize(this._firstname);
  };

  set firstname(newFirstname) {
    this._firstname = newFirstname.toLowerCase();
  };

  get lastname() {
    return capitalize(this._lastname);
  };

  set lastname(newLastname) {
    this._lastname = newLastname.toLowerCase();
  };

  static async hashPassword(password) {
    const salt = 12;
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static async create(userInfos) {
    const hashedPwd = await User.hashPassword(userInfos.password);
    const user = new User(userInfos.firstname, userInfos.lastname, userInfos.email, hashedPwd);
    const sql = `
      INSERT INTO user (firstname, lastname, email, password, email_token)
      VALUES (?, ?, ?, ?, ?);
    `;
    const params = [
      user.firstname,
      user.lastname,
      user.email,
      user.password,
      user.emailToken
    ];

    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        user.id = this.lastID;
        return resolve(user);
      });
    });
  }

  async save() {
    const sql = `
    UPDATE user
    SET firstname = ?,
        lastname = ?,
        email = ?,
        password = ?,
        email_verified = ?,
        email_token = ?,
        password_token = ?,
        password_token_date = ?,
        is_banned = ?
    WHERE id = ?;
    `;
    const params = [
      this.firstname,
      this.lastname,
      this.email,
      this.password,
      this.emailVerified,
      this.emailToken,
      this.passwordToken,
      this.passwordTokenDate,
      this.isBanned,
      this.id
    ];

    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  sendEmailVerification(host) {
    Email.sendEmailVerification({
      to: this.email,
      username: this.firstname,
      host,
      userId: this.id,
      userEmailToken: this.emailToken
    });
  };

  sendEmailResetPassword(host) {
    Email.sendEmailResetPassword({
      to: this.email,
      username: this.firstname,
      host,
      userId: this.id,
      userPasswordToken: this.passwordToken
    });
  };

  static async findOne(id) {
    const sql = `SELECT * FROM user WHERE user.id = ?;`;
    const params = [id];
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        if (row) resolve(new User(
          row.firstname,
          row.lastname,
          row.email,
          row.password,
          {
            id: row.id,
            emailVerified: row.email_verified,
            emailToken: row.email_token,
            passwordToken: row.password_token,
            passwordTokenDate: row.password_token_date,
            isBanned: row.is_banned
          }
        ));
        else resolve(null);
      });
    });
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM user WHERE user.email = ?;`;
    const params = [email];
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        if (row) resolve(new User(
          row.firstname,
          row.lastname,
          row.email,
          row.password,
          {
            id: row.id,
            emailVerified: row.email_verified,
            emailToken: row.email_token,
            passwordToken: row.password_token,
            passwordTokenDate: row.password_token_date,
            isBanned: row.is_banned
          }
        ));
        else resolve(null);
      });
    });
  }

  static async deleteByEmail(email) {
    const sql = 'DELETE FROM user WHERE user.email = ?;'
    const params = [email];
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        return resolve();
      });
    })
  }
}
