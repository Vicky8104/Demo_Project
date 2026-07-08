import axios from "axios";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";

export const uploadFile = async (req, res) => {
    console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a PDF file",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "pdfs",
          resource_type: "raw",
          public_id: req.file.originalname.replace(".pdf", ""),
          format: "pdf",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const newFile = await File.create({
      name: req.body.name || req.file.originalname.replace(".pdf", ""),
      pdfUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      file: newFile,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: "raw",
    });

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const response = await axios.get(file.pdfUrl, {
      responseType: "stream",
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      // `attachment; filename="${file.name.endsWith(".pdf") ? file.name : file.name + ".pdf"}`
       `attachment; filename="${file.name}.pdf"`
    );

   

    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
