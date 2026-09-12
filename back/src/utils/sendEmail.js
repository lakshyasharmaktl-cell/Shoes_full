const transporter = require("../config/nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Shoe Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

module.exports = sendEmail;