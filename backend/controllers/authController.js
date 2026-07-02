import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import admin from "../config/firebaseAdmin.js";


// ================= LOGIN CONTROLLER =================
export const login = async (req, res) => {
  console.log("🔥 LOGIN API HIT");
  console.log("BODY:", req.body);

  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Check password exists
    if (!user.password) {
      return res.status(500).json({ message: "Password not set for user" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Optional: Team validation
    if (user.role === "team") {
      if (!user.teamNumber) {
        return res.status(400).json({
          message: "Team number missing in DB"
        });
      }
    }

    // ✅ SUCCESS (No JWT yet - OTP step next)
    return res.json({
      message: "Credentials verified",
      phone: user.phone,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// ================= VERIFY FIREBASE OTP + LOGIN =================
export const verifyFirebaseAndLogin = async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log("🔥 VERIFY OTP HIT");
    console.log("EMAIL:", email);

    // 🔥 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("FIREBASE USER:", decoded.uid);

    // 🔍 Find user again
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Create JWT
    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        teamNumber: user.teamNumber || null
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,       // ⚠️ production me true (Render use kar rahe ho → OK)
      sameSite: "None",   // ⚠️ cross-origin ke liye required
    });

    // ✅ Final response
    return res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    console.log("FIREBASE VERIFY ERROR:", err);

    return res.status(401).json({
      message: "OTP verification failed"
    });
  }
};
