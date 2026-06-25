
import express from "express";
import { login, sendOtp, verifyOtp } from "../controllers/authController.js";
import { loginLimiter, otpLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;