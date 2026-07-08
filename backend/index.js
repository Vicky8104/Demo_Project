import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import selectionRoutes from "./routes/selectionRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import choiceRoutes from "./routes/choiceRoutes.js";
import finalSubmitRoutes from "./routes/finalSubmitRoutes.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
// import downloadRoutes from "./routes/downloadRoutes.js";



dotenv.config();

const app = express();


const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.CLIENT_URL_PROD]
    : ["http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(cookieParser()); // 🔥 MUST

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use((req, res, next) => {
  // console.log("HIT:", req.method, req.url);
  next();
});

app.set("trust proxy", 1);


app.use(express.json());

app.post("/test-login", (req, res) => {
  console.log("TEST HIT");
  res.send("OK");
});

// routes
app.use("/api", globalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/selections", selectionRoutes); // ✅ ADD THIS
app.use("/api/schools", schoolRoutes);
app.use("/api/choices", choiceRoutes);
app.use("/api/final-submit", finalSubmitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);
// app.use("/api", downloadRoutes);
app.use("/uploads", express.static("uploads"));


// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// DB connect
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));




app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB CONNECTION FAILED ❌", err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  console.log("Server shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});
