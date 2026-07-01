
import express from "express";
import { login, verifyFirebaseAndLogin } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/verify-firebase", verifyFirebaseAndLogin);

export default router;
