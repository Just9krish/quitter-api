const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

exports.sendEmail = async (
  subject,
  sendTo,
  sentFrom,
  replyTo,
  name,
  link,
  template
) => {
  // create a email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  // configure the node-mailer-handlebars
  const handlearOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlearOptions));

  // options for sending mail
  const options = {
    from: sentFrom,
    to: sendTo,
    replyTo: replyTo,
    subject: subject,
    template: template,
    context: {
      name: name,
      link: link,
    },
  };

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};
