// import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });
// // console.log("EMAIL:", process.env.EMAIL_USER);
// // console.log("PASS:", process.env.EMAIL_PASS ? "FOUND" : "MISSING");
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP is ${otp}. It will expire in 5 minutes.`
//   });
// };



import nodemailer from "nodemailer";

// 👉 transporter ko baar-baar create mat karo (performance better hoga)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    // console.log("✅ OTP email sent to:", email);

  } catch (err) {
    // console.log("❌ MAIL ERROR:", err);

    // 👉 error throw karna important hai taaki route me handle ho
    throw new Error("Email sending failed");
  }
};
