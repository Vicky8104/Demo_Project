
// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 20 * 1024 * 1024, // 20 MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== "application/pdf") {
//       return cb(new Error("Only PDF files are allowed"));
//     }

//     cb(null, true);
//   },
// });
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // ✅ 10MB limit
  },
}).single("file");

// ✅ wrapper to handle errors properly
export default (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // ❗ multer file size error
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large (Max 10MB allowed)",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

// export default upload;