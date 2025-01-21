const nodemailer = require("nodemailer");
const config = require("../config");

const emailSender = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.email,
      pass: config.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: config.email, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    //   text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  return info.messageId;
};

module.exports = {
  emailSender,
};
