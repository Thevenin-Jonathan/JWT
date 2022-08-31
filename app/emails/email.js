const path = require("path");
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const ejs = require("ejs");

class Email {
  #protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  constructor () {
    this.from = "Thevenin Jonathan <no-reply@jonathan-thevenin.fr>";
    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport(sgTransport({
        auth: {
          api_key: process.env.SENDGRID_APIKEY
        }
      }));
    } else {
      this.transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PWD
        }
      });
    }
  }

  async sendEmailVerification(options) {
    try {
      const email = {
        from: this.from,
        to: options.to,
        subject: "Vérification d'email",
        html: await ejs.renderFile(
          path.join(__dirname, "templates/email-verif.ejs"), {
          username: options.username,
          url: `${this.#protocol}://${options.host}/users/email-verification/${options.userId}/${options.userEmailToken}`
        }
        )
      };

      await this.transporter.sendMail(email);
    } catch (err) {
      console.error(err);
    }
  }

  async sendEmailResetPassword(options) {
    try {
      const email = {
        from: this.from,
        to: options.to,
        subject: "Réinitialisation du mot de passe",
        html: await ejs.renderFile(
          path.join(__dirname, "templates/reset-password.ejs"), {
          username: options.username,
          url: `${this.#protocol}://${options.host}/users/reset-password/${options.userId}/${options.userPasswordToken}`
        }
        )
      };

      await this.transporter.sendMail(email);
    } catch (err) {
      console.error(err);
    }
  }
};

exports.Email = new Email();