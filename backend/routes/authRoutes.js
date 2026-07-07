import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
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
    res.json({ message: "Candidate Dashboard" });
  }
);

export default router;
