import express from "express";
import FinalSubmission from "../models/FinalSubmission.js";
import { createPDF } from "../utils/pdfGenerator.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


// ========================================
// ✅ CHECK API (SUBMITTED + DATE STATUS)
// ========================================
router.post("/check", async (req, res) => {
  try {
    const { email, post, area, subject } = req.body;

    // 🔥 DATE CHECK
    const endDate = new Date(process.env.FORM_END);
    const now = new Date();
    const isClosed = now > endDate;

    // 🔥 DB CHECK
    const exists = await FinalSubmission.findOne({
      email,
      post,
      area,
      subject,
    });

    return res.json({
      success: true,
      submitted: !!exists,
      pdfUrl: exists?.pdfUrl || null,
      isClosed, // 🔥 important flag
    });

  } catch (err) {
    // console.log("CHECK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Check failed",
    });
  }
});


// ========================================
// ✅ FINAL SUBMIT API
// ========================================
router.post("/", async (req, res) => {
  try {
    const { selectionId, candidate, selectionData, schools, choices } = req.body;

    // ========================================
    // 🔥 1. DATE CHECK (BLOCK AFTER DEADLINE)
    // ========================================
    const endDate = new Date(process.env.FORM_END);
    const now = new Date();


    if (now > endDate) {
      return res.status(403).json({
        success: false,
        message: "Form date closed",
      });
    }

    // ========================================
    // 🔥 2. DUPLICATE CHECK
    // ========================================
    const exists = await FinalSubmission.findOne({
      email: candidate.email,
      post: selectionData.post,
      area: selectionData.area,
      subject: selectionData.subject,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already submitted",
        pdfUrl: exists.pdfUrl,
      });
    }

    // ========================================
    // 🔥 3. PDF GENERATE
    // ========================================
    const pdfBuffer = await createPDF({
      candidate,
      selectionData,
      schools,
      choices,
    });

    // ========================================
    // 🔥 4. CLOUDINARY UPLOAD
    // ========================================
    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "pdfs",
          // public_id: `form_${candidate._id}_${Date.now()}`,
          public_id:`${selectionData.post}${selectionData.area}${selectionData.subject}${selectionData.rollNo}180711.pdf`
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(stream);
    });

    // ========================================
    // 🔥 5. SAVE TO DB
    // ========================================
    const saved = await FinalSubmission.create({
      selectionId,
      candidateId: candidate._id,
      email: candidate.email,
      post: selectionData.post,
      area: selectionData.area,
      subject: selectionData.subject,
      choices,
      pdfUrl: upload.secure_url,
      status: "submitted",
    });

    // ========================================
    // ✅ RESPONSE
    // ========================================
    return res.json({
      success: true,
      message: "Form submitted successfully",
      pdfUrl: upload.secure_url,
      data: saved,
    });

  } catch (err) {
    // console.log("FINAL SUBMIT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error in final submit",
    });
  }
});

export default router;
