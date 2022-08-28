const path = require("path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");

class Email {
  constructor() {
    this.from = "JWT app <no-reply@jonathan-thevenin.fr>";
    this.transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d2b3afbec1c41b",
        pass: "b9d8dd61b02c9f"
      }
    });
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