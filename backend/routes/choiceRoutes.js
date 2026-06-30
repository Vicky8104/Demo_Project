import express from "express";
import { saveChoices } from "../controllers/choiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveChoices);

export default router;