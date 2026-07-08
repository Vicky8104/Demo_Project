

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { downloadPdf } from "../controllers/downloadController.js"; // ✅ IMPORTANT

const router = express.Router();

router.get("/secure-download/:id", protect, downloadPdf);

export default router;
