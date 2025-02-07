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