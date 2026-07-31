import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({
      email: email.toUpperCase(), // 🔥 IMPORTANT FIX
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },

      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ 🔥 YAHI LAGANA HAI

    res.json({
      message: "Login success",
      token,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: err.message });
  }
};


export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};