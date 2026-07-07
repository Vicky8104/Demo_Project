// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { secureDownloadPdf } from "../controllers/downloadController.js";

// const router = express.Router();

// // 🔐 SECURE ROUTE
// router.get("/secure-download/:id", protect, secureDownloadPdf);

// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { downloadPdf } from "../controllers/downloadController.js"; // ✅ IMPORTANT

const router = express.Router();

router.get("/secure-download/:id", protect, downloadPdf);

export default router;