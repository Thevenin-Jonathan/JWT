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

  static hashPassword(password) {
    const salt = 12;
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  static create(userInfos) {
    const hashedPwd = User.hashPassword(userInfos.password);
    const user = new User(userInfos.firstname, userInfos.lastname, userInfos.email, hashedPwd);

    const stmt = db.prepare(`
      INSERT INTO user (firstname, lastname, email, password, email_token)
      VALUES (?, ?, ?, ?, ?)
    `);
    const params = [
      user.firstname,
      user.lastname,
      user.email,
      user.password,
      user.emailToken
    ];

    const result = stmt.run(...params);
    user.id = result.lastInsertRowid;
    return user;
  }

  save() {
    const stmt = db.prepare(`
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
      WHERE id = ?
    `);

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

    stmt.run(...params);
    return;
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

  static findOne(id) {
    const stmt = db.prepare("SELECT * FROM user WHERE user.id = ?");
    const result = stmt.get(id);
    if (result) return new User(
      result.firstname,
      result.lastname,
      result.email,
      result.password,
      {
        id: result.id,
        emailVerified: result.email_verified,
        emailToken: result.email_token,
        passwordToken: result.password_token,
        passwordTokenDate: result.password_token_date,
        isBanned: result.is_banned
      }
    );
    return;
  }

  static findByEmail(email) {
    const stmt = db.prepare("SELECT * FROM user WHERE user.email = ?");
    const result = stmt.get(email);
    if (result) return new User(
      result.firstname,
      result.lastname,
      result.email,
      result.password,
      {
        id: result.id,
        emailVerified: result.email_verified,
        emailToken: result.email_token,
        passwordToken: result.password_token,
        passwordTokenDate: result.password_token_date,
        isBanned: result.is_banned
      }
    );
    return;
  }

  static deleteByEmail(email) {
    const stmt = db.prepare("DELETE FROM user WHERE user.email = ?");
    return stmt.run(email);
  }
}
