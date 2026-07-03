import nodemailer from "nodemailer";
import User from "../models/User.js";
import Otp from "../models/Otp.js"; // ⭐ NEW
import bcrypt from "bcryptjs";

// ================= SMTP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= LOGIN + SEND OTP =================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 USER CHECK
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 PASSWORD CHECK (HASHED)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 OTP GENERATE
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🧹 OLD OTP DELETE (same email ka)
    await Otp.deleteMany({ email });

    // 💾 SAVE OTP IN DB
    await Otp.create({
      email,
      otp,
      userId: user._id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // 📩 SEND EMAIL
    await transporter.sendMail({
      from: `"OTP Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      message: "OTP sent to email",
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

    // 🔍 FIND OTP
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ⏰ EXPIRY CHECK
    if (new Date() > record.expiresAt) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // 👤 GET USER
    const user = await User.findById(record.userId);

    // 🧹 DELETE OTP AFTER SUCCESS
    await Otp.deleteMany({ email });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ ROLE
      },
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
