import express from "express";
import upload from "../middleware/upload.js";
import { 
        getFiles,
        uploadFile, 
        deleteFile, 
        downloadFile, 
    } from "../controllers/fileController.js";

const router = express.Router();

router.get("/", getFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id",deleteFile);
router.get("/download/:id", downloadFile);

export default router;