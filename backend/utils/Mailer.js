const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// async function sendOTPEmail(toEmail, otp) {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: toEmail,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//     });
//     console.log("Mail sent:", info.response);
//   } catch (err) {
//     console.error("Error sending OTP email:", err);
//     throw new Error("Failed to send OTP email");
//   }
// }
async function sendOTPEmail(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    console.log("Mail sent:", info.response); // ✅ Ye dekho console me
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
}

module.exports = { sendOTPEmail };
