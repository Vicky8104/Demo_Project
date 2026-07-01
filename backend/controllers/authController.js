import User from "../models/User.js";
import jwt from "jsonwebtoken";
import otpStore from "../utils/otpStore.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// ================= LOGIN CONTROLLER =================
export const login = async (req, res) => {
  try {

    const { email, password, role, teamNumber } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // SAFE LOGS
    // console.log("DB user:", user.password);
    // console.log("Frontend password:", password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // if (user.password !== password) {
    //   return res.status(400).json({ message: "Invalid password" });
    // }

    if (role && user.role && role !== user.role) {
      return res.status(403).json({
        message: "Invalid role login attempt"
      });
    }

    if (user.role === "team") {
      if (!teamNumber) {
        return res.status(400).json({ message: "Team number required" });
      }

      if (user.teamNumber !== Number(teamNumber)) {
        return res.status(401).json({ message: "Invalid team number" });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        teamNumber: user.teamNumber || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

       res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        teamNumber: user.teamNumber
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// ================= SEND OTP =================
// export const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   const otp = Math.floor(100000 + Math.random() * 900000);

//   otpStore.set(email, {
//     otp,
//     expires: Date.now() + 5 * 60 * 1000
//   });

//   await sendEmail(email, otp); // 🔥 REAL EMAIL SEND

//   return res.json({ message: "OTP sent to email" });
// };
export const sendOtp = async (req, res) =>{
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to send OTP"
    });
  }
});

// ================= VERIFY OTP =================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = otpStore.get(email);

    if (!data) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (Date.now() > data.expires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (Number(otp) !== data.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(email);

    // 🔥 USER FIND KARO
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 TOKEN BANAO
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        teamNumber: user.teamNumber || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 YAHI COOKIE LAGANI HAI
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({
      message: "OTP verified & login successful",
      user,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
