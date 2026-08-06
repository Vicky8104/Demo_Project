
import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/", getFiles);

// router.post("/upload", upload.single("file"), uploadFile);
router.post("/upload", upload, uploadFile);

router.delete("/:id", deleteFile);

router.get("/download/:id", downloadFile);

export default router;
