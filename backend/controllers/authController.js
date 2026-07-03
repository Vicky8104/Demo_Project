import nodemailer from "nodemailer";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ================= SMTP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= OTP STORE =================
const otpStore = {};

// ================= LOGIN + SEND OTP =================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 USER CHECK
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 OTP GENERATE
    const otp = Math.floor(100000 + Math.random() * 900000);

    // STORE OTP + ROLE (IMPORTANT)
    otpStore[email] = {
      otp,
      role: user.role,   // ⭐ yahi important hai
      userId: user._id,
      expires: Date.now() + 5 * 60 * 1000,
    };

    // 📩 SEND EMAIL
    await transporter.sendMail({
      from: `"OTP Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      message: "OTP sent",
      email,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= VERIFY OTP =================
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = otpStore[email];

    if (!data) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (Date.now() > data.expires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (data.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ SUCCESS
    const user = await User.findById(data.userId);

    delete otpStore[email];

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // ⭐ FINAL ROLE RETURN
      },
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
