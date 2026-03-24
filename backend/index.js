// const express = require("express");
// const mongoose = require("mongoose");
// const rateLimit = require("express-rate-limit");
// const cors = require("cors");
// require("dotenv").config();


// const authRoutes = require("./routes/auth");
// const { sendOTPEmail } = require("./utils/Mailer");

// console.log("MONGO_URL =", process.env.MONGO_URL);
// const app = express();
// // app.use(cors({ origin: "http://localhost:3000" }));


// app.use(cors({
//   origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
//   credentials: true
// }));
// app.use(express.json());

// const otpLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 10,
//   message: "Too many requests, please try again later",
// });

// app.use("/api/send-otp", otpLimiter);

// // 🔥 routes
// app.use("/api", require("./routes/authRoutes"));
// // mongoose.connect(
// //   "mongodb+srv://vicky_8104:gfGT3ClwMOEB7MLE@cluster0.s4rsajb.mongodb.net/Teacher?retryWrites=true&w=majority"
// // )
// // .then(() => console.log("MongoDB connected ✅"))
// // .catch(err => console.log(err));


// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB connected ✅"))
//   .catch((err) => console.log(err));

// app.get("/test-mail", async (req, res) => {
//   try {
//     await sendOTPEmail("vkumarjangid7543@gmail.com", "123456");
//     res.send("OTP test mail sent!");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });


// // Prefixing the routes with /api
// // app.use("/api", authRoutes);
// // app.get("/", (req, res) => {
// //   res.send("Backend Running 🚀");
// // });


// app.use("/pdfs", express.static("pdfs"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/auth");
const { sendOTPEmail } = require("./utils/Mailer");

console.log("MONGO_URL =", process.env.MONGO_URL);
const app = express();
// app.use(cors({ origin: "http://localhost:3000" }));


app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
  credentials: true
}));
app.use(express.json());

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: "Too many requests, please try again later",
});

app.use("/api/send-otp", otpLimiter);

// 🔥 routes
app.use("/api", require("./routes/auth"));
// mongoose.connect(
//   "mongodb+srv://vicky_8104:gfGT3ClwMOEB7MLE@cluster0.s4rsajb.mongodb.net/Teacher?retryWrites=true&w=majority"
// )
// .then(() => console.log("MongoDB connected ✅"))
// .catch(err => console.log(err));


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

app.get("/test-mail", async (req, res) => {
  try {
    await sendOTPEmail("vkumarjangid7543@gmail.com", "123456");
    res.send("OTP test mail sent!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Prefixing the routes with /api
// app.use("/api", authRoutes);
// app.get("/", (req, res) => {
//   res.send("Backend Running 🚀");
// });


app.use("/pdfs", express.static("pdfs"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
