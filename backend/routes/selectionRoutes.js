import express from "express";

const router = express.Router();

import { getSelections, getSelectionWithUser } from "../controllers/selectionController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/", protect, getSelections);

router.get("/:id/details", protect, getSelectionWithUser);

export default router;

