const nodemailer = require("nodemailer");
var smtpConfiq = {
  service: "Gmail",
  auth: {
    user: "noreplydummy125@gmail.com",
    pass: "kqswulhtckzdcdna",
  },
};
const generatemail = async (email, subject, html) => {
  try {
    let transporter = nodemailer.createTransport(smtpConfiq);
    const mailOptions = {
      from: "ali27muhammad56@gmail.com",
      to: email,
      subject,
      text: "Dummy text",
      html,
    };
    let res = await transporter.sendMail(mailOptions);
    console.log(res);
  } catch (err) {
    console.log("mail did not generated", err);
  }
};

module.exports = generatemail;
