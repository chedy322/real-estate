const nodemailer = require('nodemailer');
require('dotenv').config();

console.log(process.env.HOST); // Ensure HOST is correctly logged

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const send_email = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.email && !req.body.message) {
      return res.status(400).json({ message: 'Email and message are required' });
    }

    const info = await transporter.sendMail({
      from: req.body.email, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: "Real Estate", // Subject line
      text: req.body.message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully" });

  } catch (err) {
    console.error("Error sending email:", err); // Detailed error logging
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
};

module.exports = send_email;
