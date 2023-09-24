// email/nodemailerSetup.js

const nodemailer = require('nodemailer');// Replace with your email service credentials
const config = require('../config/config');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: config.nodemailerService,
  auth: {
    user: config.nodemailerEmail,
    pass: config.nodemailerPassword,
  },
});

// Send an email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: config.nodemailerFrom,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
