import express from "express";
import { login, verifyFirebaseAndLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyFirebaseAndLogin);

export default router;
