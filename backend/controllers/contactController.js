const Contact = require('../models/contactModel');
const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    console.log('Environment variables:', {
      EMAIL_USER: process.env.EMAIL_USER,
      RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL,
      // Don't log EMAIL_PASS for security
    });

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    console.log('Contact form saved to database');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Contact Form Submission',
      text: `New form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    console.log('Attempting to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact form or sending email:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
};
