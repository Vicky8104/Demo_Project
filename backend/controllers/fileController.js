import axios from "axios";
import { files } from "../models/fileModel.js";
import File from "../models/File.js";


// ✅ Date-wise grouping
export const getFiles = async (req, res) => {
  try {
    const sorted = files.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};
// export const getFiles = (req, res) => {
//   // sort latest first
//   const sorted = files.sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   // group by date
//   const grouped = {};

//   sorted.forEach((file) => {
//     const date = new Date(file.createdAt).toDateString();

//     if (!grouped[date]) {
//       grouped[date] = [];
//     }

//     grouped[date].push(file);
//   });

//   res.json(grouped);
// };
export const uploadFile = async (req, res)=>{
    try{
      const file = new File ({
        name: req.body.name,
        pdfUrl: req.file.path,
      });

      await file.save();
      res.json({message:"Uploaded", file});
    }catch{
      res.status(500).json({message: "Upload Failed"});
    }
};

export const deleteFile = async (req, res)=>{
  try{
      await File.findByIdAndDelete(req.params.id);
      res.json({message:"Deleted Successfully"});
      
  }catch{
      res.status(500).json({message:"Delete Failed"});
  }
};




// ✅ Download
export const downloadFile = async (req, res) => {
  try {
    const file = files.find((f) => f._id === req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const response = await axios.get(file.pdfUrl, {
      responseType: "stream",
    });

    const totalSize = response.headers["content-length"];

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.name}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    if (totalSize) {
      res.setHeader("Content-Length", totalSize);
    }

    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};