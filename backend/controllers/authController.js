import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import admin from "../config/firebaseAdmin.js";
// ================= LOGIN CONTROLLER =================
export const login = async (req, res) => {
try {
const { email, password, role, teamNumber } = req.body;

```
const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({ message: "User not found" });
}
if (!user.password) {
  return res.status(500).json({ message: "Password not set for user" });
}
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({ message: "Invalid password" });
}

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

// 🔥 NO JWT HERE
return res.json({
  message: "Credentials verified",
  phone: user.phone,
  email: user.email
});
```

} catch (error) {
return res.status(500).json({ error: error.message });
}
};


//=============== verify otp ====================
export const verifyFirebaseAndLogin = async (req, res) => {
try {
const { token, email } = req.body;

```
// 🔥 Firebase token verify
const decoded = await admin.auth().verifyIdToken(token);

// 🔥 User find
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// 🔥 FINAL JWT
const jwtToken = jwt.sign(
  {
    id: user._id,
    role: user.role,
    teamNumber: user.teamNumber || null
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

// 🔥 Cookie set
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
});

return res.json({
  message: "Login successful",
  user
});
```

} catch (err) {
console.log("FIREBASE VERIFY ERROR:", err);
return res.status(401).json({ message: "OTP verification failed" });
}
};
