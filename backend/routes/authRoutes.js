import express from "express";
import {
  loginController,
  verifyOtpController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);

export default router;
