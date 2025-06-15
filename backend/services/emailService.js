const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendOTPEmail = async (email, otp, type = "signup") => {
  try {
    let subject, html;

    if (type === "password_reset") {
      subject = "Password Reset OTP";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #016A6D;">Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #FFAA5D; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated email, please do not reply.
          </p>
        </div>
      `;
    } else {
      subject = "Email Verification OTP";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #016A6D;">Email Verification</h2>
          <p>Please use the following OTP to verify your email:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #FFAA5D; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated email, please do not reply.
          </p>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ ${type === "password_reset" ? "Password reset" : "Verification"} OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

exports.sendCheckoutLinkEmail = async (email, productName, checkoutUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Complete Your Purchase for ${productName}`,
    html: `
      <p>Hi,</p>
      <p>You have an accepted bid for <strong>${productName}</strong>.</p>
      <p>Please complete your purchase using the button below:</p>
      <a href="${checkoutUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Pay Now</a>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p>${checkoutUrl}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📩 Stripe Checkout Email Sent to:", email);
};

exports.sendBidRejectEmail = async (email, productName, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${userName} has rejected payment for ${productName}! So you can select any other buyer.`,
    html: `
      <p>Hi,</p>
      <p>${userName} bid has been rejected for ${productName}! So you can select any other buyer.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📩 Bid Rejected Email Sent to:", email);
};
exports.sendBidRejectEmailForBuyer = async (email, productName, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Bid Rejected For ${productName}!.`,
    html: `
      <p>Hi,</p>
      <p>${userName} you bid has been rejected payment for ${productName}! You can Bid Again if you want.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📩 Bid Rejected Email Sent to:", email);
};

exports.sendPaymentSuccessEmail = async (to, productName, type, name) => {
  let subject, html;

  if (type === 'buyer') {
    subject = 'Payment Successful - Thank You for Your Purchase!';
    html = `
      <p>Hi ${name},</p>
      <p>Thank you for your payment. You've successfully purchased <strong>${productName}</strong>.</p>
      <p>We'll notify the seller and keep you updated.</p>
      <p>Best regards,<br/>KuchBhi Team</p>
    `;
  } else if (type === 'seller') {
    subject = 'Your Product Has Been Sold!';
    html = `
      <p>Hi ${name},</p>
      <p>Good news! Your product <strong>${productName}</strong> has been sold and payment has been received.</p>
      <p>You can now proceed to coordinate delivery or next steps with the buyer.</p>
      <p>Best regards,<br/>KuchBhi Team</p>
    `;
  } else {
    throw new Error("Invalid type passed to sendPaymentSuccessEmail");
  }

  const mailOptions = {
    from: `"Bid Mart 2025" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Payment success email sent to ${type}: ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
};

module.exports = {
  sendOTPEmail,
};