import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(), // 🔥 IMPORTANT FIX
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
      process.env.JWT_SECRET
    );

    // ✅ 🔥 YAHI LAGANA HAI
    // const isProd = process.env.NODE_ENV === "production";

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: isProd,
    //   sameSite: isProd ? "None" : "lax",
    // });
    res.cookie("token", token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "None", 
      path: "/",
    });

    res.json({
      message: "Login success",
      user: {
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


export const logoutUser = (req, res) => {
  // const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: "None", 
      path: "/",
    });

  res.json({ message: "Logged out successfully" });
};
