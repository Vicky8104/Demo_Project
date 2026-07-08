
// export default router;
import express from "express";
import { getSchools } from "../controllers/schoolController.js";

const router = express.Router();

router.get("/", getSchools);

export default router;
