const path = require("path");
const nodemailer = require("nodemailer");
const sparkPostTransporter = require("nodemailer-sparkpost-transport");
const ejs = require("ejs");

class Email {
  constructor () {
    this.from = "JWT app <no-reply@jonathan-thevenin.fr>";
    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport(
        sparkPostTransporter({
          sparkPostApiKey: process.env.SPARKPOST_APIKEY,
          endpoint: "https://api.eu.sparkpost.com"
        })
      );
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
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const email = {
        from: this.from,
        to: options.to,
        subject: "Vérification d'email",
        html: await ejs.renderFile(
          path.join(__dirname, "templates/email-verif.ejs"), {
          username: options.user,
          url: `${protocol}://${options.host}/users/email-verification/${options.userId}/${options.userEmailToken}`
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