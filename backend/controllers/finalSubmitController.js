import FinalSubmission from "../models/FinalSubmission.js";
import { createPDF } from "../utils/pdfGenerator.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import CounselingConfig from "../models/CounselingConfig.js";



// ========================================
// ✅ CHECK API
// ========================================
export const checkSubmission = async (req, res) => {
  try {
    const { email, post, area, subject } = req.body;

    // const endDate = new Date(process.env.FORM_END);
    // const now = new Date();
    // const isClosed = now > endDate;

    const config = await CounselingConfig.findOne({
      post,
      area,
      subject
    });
    const now = new Date();
    const isClosed =
      !config ||
      !config.isActive ||
      now < new Date(config.startDate) ||
      now > new Date(config.endDate);

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
      isClosed,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Check failed",
    });
  }
};



// ========================================
// ✅ FINAL SUBMIT
// ========================================
export const finalSubmit = async (req, res) => {
  try {
    // console.log("BODY AA RHA:", req.body); // 🔥 DEBUG

    const { selectionId, candidate, selectionData, schools, choices } = req.body;

    // ========================================
    // 🔥 DATE CHECK
    // ========================================
    // const endDate = new Date(process.env.FORM_END);
    // if (new Date() > endDate) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Form date closed",
    //   });
    // }
    const config = await CounselingConfig.findOne({
      post: selectionData?.post,
      area: selectionData?.area,
      subject: selectionData?.subject,
    });

    if (
      !config ||
      !config.isActive ||
      new Date() < new Date(config.startDate) ||
      new Date() > new Date(config.endDate)
    ) {
      return res.status(403).json({
        success: false,
        message: "Form date closed",
      });
    }

    // ========================================
    // 🔥 DUPLICATE CHECK
    // ========================================
    const exists = await FinalSubmission.findOne({
      email: candidate?.email,
      post: selectionData?.post,
      area: selectionData?.area,
      subject: selectionData?.subject,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already submitted",
        pdfUrl: exists.pdfUrl,
      });
    }

    // ========================================
    // 🔥 PDF GENERATE
    // ========================================
    const pdfBuffer = await createPDF({
      candidate,
      selectionData,
      schools,
      choices,
    });

    // ========================================
    // 🔥 CLOUDINARY UPLOAD
    // ========================================
    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "pdfs",
          public_id: `${selectionData.post}${selectionData.area}${selectionData.subject}${selectionData.rollNo}180711.pdf`
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(stream);
    });

    // ========================================
    // 🔥 SAVE FULL DATA
    // ========================================
    const saved = await FinalSubmission.create({
      selectionId,

      // ✅ candidate data
      candidateId: candidate?._id,
      name: candidate?.name,
      fatherName: candidate?.fatherName,
      dob: candidate?.dob,
      gender: candidate?.gender,
      maritalStatus: candidate?.maritalStatus,
      homeDistrict: candidate?.homeDistrict,
      category: candidate?.category,
      email: candidate?.email,
      mobile: candidate?.mobile,
      ifOther: candidate?.ifOther,

      // ✅ selection data
      post: selectionData?.post,
      area: selectionData?.area,
      subject: selectionData?.subject,
      rollNo: selectionData?.rollNo,
      meritNo: selectionData?.meritNo,
      selCategory: selectionData?.selCategory,
      splCategory: selectionData?.splCategory,

      // ✅ choices
      choices,

      // ✅ pdf
      pdfUrl: upload.secure_url,

      status: "submitted",
    });

    return res.json({
      success: true,
      message: "Form submitted successfully",
      pdfUrl: upload.secure_url,
      data: saved,
    });

  } catch (err) {
    console.log("FINAL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error in final submit",
    });
  }
};