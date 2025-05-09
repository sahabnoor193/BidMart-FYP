// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Your Gmail
//     pass: process.env.EMAIL_PASS, // App password
//   },
// });

// exports.sendVerificationEmail = async (email, token) => {
//   const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${token}`;
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify Your Email",
//     html: `<p>Click the button below to verify your email and complete your registration:</p>
//            <a href="${verificationLink}" style="padding:10px 20px; background-color:blue; color:white; text-decoration:none;">Verify Email</a>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email Transport Error:", error);
//   } else {
//     console.log("✅ Email Transport Ready");
//   }
// });

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

exports.sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    
    subject: "Your OTP Code for Verification",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log("📩 OTP Email Sent to:", email);
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
      <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
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
