const nodemailer = require("nodemailer");

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
      const email = {
        from: this.from,
        to: options.to,
        subject: "Vérification d'email",
        text: "test d'envoi d'email de férification"
      };

      const response = await this.transporter.sendMail(email);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
};

exports.Email = new Email();