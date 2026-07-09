import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);

// protected route
router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "User dashboard" });
});

// admin route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin panel" });
  }
);
router.get(
  "/candidate",
  protect,
  authorizeRoles("candidate"),
  (req, res) => {
    // console.log("CANDIDATE ROUTE HIT");
    // console.log("REQ.USER:", req.user);
    res.json({ message: "Candidate Dashboard" });
  }
);

export default router;
