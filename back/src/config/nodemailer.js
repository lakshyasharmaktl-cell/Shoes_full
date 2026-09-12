const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Nodemailer config error:", error.message);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

module.exports = transporter;