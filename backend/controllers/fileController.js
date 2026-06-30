// import axios from "axios";
// import { files } from "../models/fileModel.js";
// import File from "../models/File.js";


// // ✅ Date-wise grouping
// // export const getFiles = async (req, res) => {
// //   try {
// //     const sorted = files.sort(
// //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //     );

// //     res.json(sorted);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching files" });
// //   }
// // };
// export const getFiles = async (req, res) => {
//   try {
//     const files = await File.find().sort({ createdAt: -1 });
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching files" })
//   }
// };
// // export const getFiles = (req, res) => {
// //   // sort latest first
// //   const sorted = files.sort(
// //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //   );

// //   // group by date
// //   const grouped = {};

// //   sorted.forEach((file) => {
// //     const date = new Date(file.createdAt).toDateString();

// //     if (!grouped[date]) {
// //       grouped[date] = [];
// //     }

// //     grouped[date].push(file);
// //   });

// //   res.json(grouped);
// // };

// // export const uploadFile = async (req, res) => {
// //   try {
// //         const file = new File({
// //           name : req.body.name,
// //           pdfUrl: `http://localhost:5000/upload/${req.file.filename}`,
// //         });
// //         await file.save();
// //         res.json({message: "Uploaded", file});
// //   } catch (err){
// //     console.error(err);
// //     res.status(500).json({message : "Upload Failed"});

// //   }
// // };

// export const uploadFile = async (req, res) => {
//   try {
//     // ✅ safety check
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = new File({
//       name: req.body.name,
//       pdfUrl: `http://localhost:5000/uploads/${req.file.filename}`, // ✅ FIX
//     });

//     await file.save();

//     res.json({ message: "Uploaded", file });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload Failed" });
//   }
// };

// // export const uploadFile = async (req, res)=>{
// //     try{
// //       const file = new File ({
// //         name: req.body.name,
// //         pdfUrl: req.file.path,
// //       });

// //       await file.save();
// //       res.json({message:"Uploaded", file});
// //     }catch{
// //       res.status(500).json({message: "Upload Failed"});
// //     }
// // };

// export const deleteFile = async (req, res) => {
//   try {
//     await File.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted Successfully" });

//   } catch {
//     res.status(500).json({ message: "Delete Failed" });
//   }
// };




// // ✅ Download
// // export const downloadFile = async (req, res) => {
// //   try {
// //     const file = files.find((f) => f._id === req.params.id);

// //     if (!file) {
// //       return res.status(404).json({ message: "File not found" });
// //     }

// //     const response = await axios.get(file.pdfUrl, {
// //       responseType: "stream",
// //     });

// //     const totalSize = response.headers["content-length"];

// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename=${file.name}.pdf`
// //     );
// //     res.setHeader("Content-Type", "application/pdf");

// //     if (totalSize) {
// //       res.setHeader("Content-Length", totalSize);
// //     }

// //     response.data.pipe(res);
// //   } catch (error) {
// //     res.status(500).json({ message: "Download failed" });
// //   }
// // };

// export const downloadFile = async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id); // ✅ FIX

//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     const response = await axios.get(file.pdfUrl, {
//       responseType: "stream",
//     });

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${file.name}.pdf` // ✅ FIX
//     );

//     res.setHeader("Content-Type", "application/pdf");

//     response.data.pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Download failed" });
//   }
// };



import axios from "axios";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";

export const uploadFile = async (req, res) => {
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
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const newFile = await File.create({
      name: req.body.name,
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

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.pdf"`
    );

    res.setHeader("Content-Type", "application/pdf");

    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};