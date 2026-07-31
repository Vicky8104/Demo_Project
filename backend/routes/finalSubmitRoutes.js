import express from "express";
import { finalSubmit, checkSubmission } from "../controllers/finalSubmitController.js";

const router = express.Router();

router.post("/check", checkSubmission);
router.post("/", finalSubmit);

export default router;