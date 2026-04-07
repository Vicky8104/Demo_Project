// const User = require("../models/User");
// const School = require("../models/School");
// const jwt = require("jsonwebtoken");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");


// // ✅ SAFE REGEX HELPER
// const escapeRegex = (text) =>
// text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// // ================= LOGIN USER =================
// async function loginUser(req, res) {
//   try {
//     const { post, subject, rollno, mobile, email, dob } = req.body;
//       console.log("REQ BODY:", req.body);
//     const user = await User.findOne({
//       post: new RegExp(`^${escapeRegex(post)}$`, "i"),
//       subject: new RegExp(`^${escapeRegex(subject)}$`, "i"),
//       rollno: String(rollno).trim(),
//       mobile: String(mobile).trim(),
//       email: new RegExp(`^${escapeRegex(email)}$`, "i"),
//       dob: dob
//     });
//       console.log("FOUND USER:", user);
//     if (!user) {
//       return res.status(404).json({ message: "Invalid details" });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         post: user.post,
//         subject: user.subject,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user
//     });

//   } catch (err) {
//     console.error("❌ LOGIN ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ================= GET USER =================
// async function getUser(req, res) {
//   try {
//     const user = await User.findById(req.userId); // ✅ FIX

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ user });

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// }

// // ================= GET SCHOOLS =================
// async function getSchools(req, res) {
//   try {
//     let { post, subject } = req.query;

//     post = post?.trim();
//     subject = subject?.trim();

//     const schools = await School.find({
//       post: { $regex: post, $options: "i" },
//       subject: { $regex: subject, $options: "i" },
//     });

//     res.status(200).json({ schools });

//   } catch (err) {
//     console.error("❌ GET SCHOOLS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// }

// // ================= SUBMIT SCHOOLS =================
// async function submitSchools(req, res) {
//   try {
//     const { selectedSchools } = req.body;

//     const user = await User.findById(req.userId); // ✅ FIX

//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.formSubmitted) {
//       return res.status(403).json({ message: "Form locked" });
//     }

//     user.schoolChoices = selectedSchools;
//     await user.save();

//     res.status(200).json({
//       message: "School choices saved successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }


// async function submitFinalForm(req, res) {
//   try {

//     const now = new Date();
//     const start = new Date(process.env.FORM_START);
//     const end = new Date(process.env.FORM_END);

//     if (now < start) {
//       return res.status(403).json({ message: "Form not started yet" });
//     }

//     if (now > end) {
//       return res.status(403).json({ message: "Form closed" });
//     }



//     const { personalData, schoolData, schoolNames } = req.body;
    
//     if (!schoolNames || schoolNames.length === 0) {
//     return res.status(400).json({ message: "No school selected" });
//     }

//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.formSubmitted) {
//       return res.status(403).json({
//         message: "Form already submitted. You cannot submit again",
//       });
//     }

//     user.maritalStatus = personalData.maritalStatus;
//     user.homeDistrict = personalData.homeDistrict;
//     user.otherCategory = personalData.otherCategory;

//     user.schoolChoices = schoolNames;

//     // ✅ PDF CREATE
//     const doc = new PDFDocument({ margin: 40 });

//     const chunks = [];
//     doc.on("data", (chunk) => chunks.push(chunk));

//     // ================= HEADER =================
//     const leftX = 40;
//     const pageWidth =
//       doc.page.width - doc.page.margins.left - doc.page.margins.right;

//     let y = doc.y;

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(25)
//       .text("Department of Sanskrit Education", 0, y, {
//         align: "center",
//       });

//     doc.moveDown(0.3);

//     doc
//       .moveTo(doc.page.margins.left, doc.y)
//       .lineTo(doc.page.width - doc.page.margins.right, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     doc.fontSize(16).text("Counseling Application Form", {
//       align: "center",
//     });

//     doc.moveDown(0.3);

//     doc.text(`Post: ${user.post} | Subject: ${user.subject}`, {
//       align: "center",
//       fontSize: 12,
//     });

//     doc.moveDown(2);

//     // ================= PERSONAL DETAILS =================
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("PERSONAL DETAILS", 0, doc.y, { align: "center" });

//     doc.moveDown(0.5);

//     y = doc.y;

//     const rowHeight = 24;
//     const totalRows = 5;
//     const boxHeight = rowHeight * totalRows;

//     doc.rect(leftX, y, pageWidth, boxHeight).stroke();

//     doc
//       .moveTo(leftX + pageWidth / 2, y)
//       .lineTo(leftX + pageWidth / 2, y + boxHeight)
//       .stroke();

//     function row(label1, value1, label2, value2, index) {
//       const rowY = y + index * rowHeight;

//       if (index !== 0) {
//         doc
//           .moveTo(leftX, rowY)
//           .lineTo(leftX + pageWidth, rowY)
//           .stroke();
//       }

//       doc.font("Helvetica-Bold").fontSize(10).text(`${label1}:`, leftX + 5, rowY + 6);
//       doc.font("Helvetica").text(value1 || "-", leftX + 90, rowY + 6);

//       doc
//         .font("Helvetica-Bold")
//         .text(`${label2}:`, leftX + pageWidth / 2 + 5, rowY + 6);

//       doc
//         .font("Helvetica")
//         .text(value2 || "-", leftX + pageWidth / 2 + 90, rowY + 6);
//     }

//     row("Name", user.name, "Father Name", user.fatherName, 0);
//     row("DOB", user.dob, "Gender", user.gender, 1);
//     row("Category", user.category, "Mobile", user.mobile, 2);
//     row("Email", user.email, "Marital Status", user.maritalStatus, 3);
//     row("Home District", user.homeDistrict, "Merit No", user.meritNo, 4);

//     doc.moveDown(2);

//     // ================= SCHOOL CHOICES =================
//     doc.y = y + boxHeight + 30;

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("School Choices", 0, doc.y, { align: "center" });

//     doc.moveDown(0.5);

//     // let schoolTop = doc.y;

//     // const choiceRowHeight = 24;
//     // const totalRowsChoice = Math.ceil(schoolNames.length / 2);
//     // const schoolBoxHeight = totalRowsChoice * choiceRowHeight;

//     // doc.rect(leftX, schoolTop, pageWidth, schoolBoxHeight).stroke();

//     // doc
//     //   .moveTo(leftX + pageWidth / 2, schoolTop)
//     //   .lineTo(leftX + pageWidth / 2, schoolTop + schoolBoxHeight)
//     //   .stroke();

//     // for (let i = 0; i < schoolNames.length; i += 2) {
//     //   const rowIndex = Math.floor(i / 2);
//     //   const rowY = schoolTop + rowIndex * choiceRowHeight;

//     //   if (rowIndex !== 0) {
//     //     doc
//     //       .moveTo(leftX, rowY)
//     //       .lineTo(leftX + pageWidth, rowY)
//     //       .stroke();
//     //   }

//     //   const name1 = schoolNames[i];
//     //   const name2 = schoolNames[i + 1];

//     //   doc
//     //     .font("Helvetica-Bold")
//     //     .fontSize(10)
//     //     .text(`Choice ${i + 1}:`, leftX + 5, rowY + 6);

//     //   doc.font("Helvetica").text(name1 || "-", leftX + 80, rowY + 6, {
//     //     width: pageWidth / 2 - 90,
//     //   });
//     let schoolTop = doc.y;
// const padding = 6;

// // vertical line (center)
// doc
//   .moveTo(leftX + pageWidth / 2, schoolTop)
//   .lineTo(leftX + pageWidth / 2, schoolTop + 1000)
//   .stroke();

// for (let i = 0; i < schoolNames.length; i += 2) {
//   const name1 = schoolNames[i] || "-";
//   const name2 = schoolNames[i + 1] || "-";

//   const textWidth = pageWidth / 2 - 90;

//   const h1 = doc.heightOfString(name1, { width: textWidth });
//   const h2 = doc.heightOfString(name2, { width: textWidth });

//   const rowHeight = Math.max(h1, h2) + padding * 2;

//   const rowY = doc.y;

//   // horizontal line
//   if (i !== 0) {
//     doc.moveTo(leftX, rowY).lineTo(leftX + pageWidth, rowY).stroke();
//   }

//   doc.font("Helvetica-Bold").fontSize(10)
//     .text(`Choice ${i + 1}:`, leftX + 5, rowY + padding);

//   doc.font("Helvetica")
//     .text(name1, leftX + 80, rowY + padding, { width: textWidth });

//   if (schoolNames[i + 1]) {
//     doc.font("Helvetica-Bold")
//       .text(`Choice ${i + 2}:`, leftX + pageWidth / 2 + 5, rowY + padding);

//     doc.font("Helvetica")
//       .text(name2, leftX + pageWidth / 2 + 80, rowY + padding, {
//         width: textWidth,
//       });
//   }

//   doc.moveDown();
// }

//       if (name2) {
//         doc
//           .font("Helvetica-Bold")
//           .text(`Choice ${i + 2}:`, leftX + pageWidth / 2 + 5, rowY + 6);

//         doc.font("Helvetica").text(name2, leftX + pageWidth / 2 + 80, rowY + 6, {
//           width: pageWidth / 2 - 90,
//         });
//       }
//     }

//     // ================= SIGNATURE =================
//     doc.moveDown(4);

//     const signX = doc.page.width - 200;

//     doc.font("Helvetica-Bold").text("Candidate Signature", signX);

//     doc.moveDown();

//     doc
//       .font("Helvetica")
//       .text(`Name: ${user.name}`, signX)
//       .text(`Post: ${user.post}`, signX)
//       .text(`Subject: ${user.subject}`, signX);

//     // const now = new Date();

//     doc.text(`Date: ${now.toLocaleDateString()}`, signX);

//     // ✅ FINALIZE PDF
// //     doc.end();

// //     // ✅ SAVE AFTER PDF READY
// //     doc.on("end", async () => {
// //       try {
// //         const pdfBuffer = Buffer.concat(chunks);

// //         let pdfUrl = "";

// //         if (process.env.NODE_ENV === "production") {
// //           const cloudinary = require("../utils/cloudinary");

// //           const result = await new Promise((resolve, reject) => {
// //             cloudinary.uploader.upload_stream(
// //               {
// //                 resource_type: "raw",
// //                 folder: "pdfs",
// //                 public_id: user._id.toString(),
// //               },
// //               (error, result) => {
// //                 if (error) return reject(error);
// //                 resolve(result);
// //               }
// //             ).end(pdfBuffer);
// //           });

// //           pdfUrl = result.secure_url;

// //         } else {
// //           const pdfFolder = path.join(__dirname, "../pdfs");

// //           if (!fs.existsSync(pdfFolder)) {
// //             // fs.mkdirSync(pdfFolder);
// //             fs.mkdirSync(pdfFolder, { recursive: true });
// //           }

// //           const pdfPath = path.join(pdfFolder, `${user._id}.pdf`);
// //           fs.writeFileSync(pdfPath, pdfBuffer);

// //           pdfUrl = `/pdfs/${user._id}.pdf`;
// //         }

// //         user.pdfUrl = pdfUrl;
// //         user.formSubmitted = true;

// //         await user.save();

// //         res.json({
// //           message: "Form submitted successfully",
// //           pdfUrl,
// //         });

// //       } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ message: "Error generating PDF" });
// //       }
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: err.message });
// //   }
// // }
// // ✅ FINALIZE PDF

// // 🔥 FIX: end listener pehle lagao
// doc.on("end", async () => {
//   try {
//     const pdfBuffer = Buffer.concat(chunks);

//     let pdfUrl = "";

//     if (process.env.NODE_ENV === "production") {
//       const cloudinary = require("../utils/cloudinary");

//       const result = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           {
//             resource_type: "raw",
//             folder: "pdfs",
//             // public_id: user._id.toString(),
//   public_id: `${user.post}_${user.subject}_${user.rollno}`
//   .replace(/\s+/g, "_")
//   .replace(/[^a-zA-Z0-9_]/g, ""),
//           },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         ).end(pdfBuffer);
//       });

//       pdfUrl = result.secure_url;

//     } else {
//       const pdfFolder = path.join(__dirname, "../pdfs");

//       if (!fs.existsSync(pdfFolder)) {
//         fs.mkdirSync(pdfFolder, { recursive: true });
//       }

//       // const pdfPath = path.join(pdfFolder, `${user._id}.pdf`);
// const fileName = `${user.post}_${user.subject}_${user.rollno}`
//   .replace(/\s+/g, "_")
//   .replace(/[^a-zA-Z0-9_]/g, "") + ".pdf";

// const pdfPath = path.join(pdfFolder, fileName);
//       fs.writeFileSync(pdfPath, pdfBuffer);

//       // pdfUrl = `/pdfs/${user._id}.pdf`;
//       pdfUrl = `/pdfs/${fileName}`;
//     }

//     user.pdfUrl = pdfUrl;
//     user.formSubmitted = true;

//     await user.save();

//     res.json({
//       message: "Form submitted successfully",
//       pdfUrl,
//     });

//   } catch (err) {
//     console.error("🔥 PDF ERROR:", err);
//     res.status(500).json({ message: "Error generating PDF", error: err.message });
//   }
// });

// // ❗ LAST me end karo
// doc.end();
//     } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: err.message });
// }
// }


// module.exports = {
//   loginUser,
//   getUser,
//   getSchools,
//   submitSchools,
//   submitFinalForm,
// };



const User = require("../models/User");
const School = require("../models/School");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ✅ SAFE REGEX HELPER
const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ================= LOGIN USER =================
async function loginUser(req, res) {
  try {
    const { post, subject, rollno, mobile, email, dob } = req.body;

    const user = await User.findOne({
      post: new RegExp(`^${escapeRegex(post)}$`, "i"),
      subject: new RegExp(`^${escapeRegex(subject)}$`, "i"),
      rollno: String(rollno).trim(),
      mobile: String(mobile).trim(),
      email: new RegExp(`^${escapeRegex(email)}$`, "i"),
      dob: dob,
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid details" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        post: user.post,
        subject: user.subject,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================= GET USER =================
async function getUser(req, res) {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// ================= GET SCHOOLS =================
async function getSchools(req, res) {
  try {
    let { post, subject } = req.query;

    post = post?.trim();
    subject = subject?.trim();

    const schools = await School.find({
      post: { $regex: post, $options: "i" },
      subject: { $regex: subject, $options: "i" },
    });

    res.status(200).json({ schools });
  } catch (err) {
    console.error("❌ GET SCHOOLS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}

// ================= SUBMIT SCHOOLS =================
async function submitSchools(req, res) {
  try {
    const { selectedSchools } = req.body;

    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.formSubmitted) {
      return res.status(403).json({ message: "Form locked" });
    }

    user.schoolChoices = selectedSchools;
    await user.save();

    res.status(200).json({
      message: "School choices saved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================= FINAL SUBMIT =================
async function submitFinalForm(req, res) {
  try {
    const now = new Date();
    const start = new Date(process.env.FORM_START);
    const end = new Date(process.env.FORM_END);

    if (now < start) {
      return res.status(403).json({ message: "Form not started yet" });
    }

    if (now > end) {
      return res.status(403).json({ message: "Form closed" });
    }

    const { personalData, schoolNames } = req.body;

    if (!schoolNames || schoolNames.length === 0) {
      return res.status(400).json({ message: "No school selected" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.formSubmitted) {
      return res.status(403).json({
        message: "Form already submitted",
      });
    }

    user.maritalStatus = personalData.maritalStatus;
    user.homeDistrict = personalData.homeDistrict;
    user.otherCategory = personalData.otherCategory;
    user.schoolChoices = schoolNames;

    // ================= PDF =================
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    const leftX = 40;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // HEADER
    doc.font("Helvetica-Bold").fontSize(25).text("Department of Sanskrit Education", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Counseling Application Form", { align: "center" });
    doc.moveDown();
    doc.text(`Post: ${user.post} | Subject: ${user.subject}`, { align: "center" });

    doc.moveDown(2);

    // PERSONAL DETAILS
    doc.font("Helvetica-Bold").text("PERSONAL DETAILS", { align: "center" });
    doc.moveDown();

    let y = doc.y;
    const rowHeight = 24;
    const boxHeight = rowHeight * 5;

    doc.rect(leftX, y, pageWidth, boxHeight).stroke();

    doc.moveTo(leftX + pageWidth / 2, y)
      .lineTo(leftX + pageWidth / 2, y + boxHeight)
      .stroke();

    function row(label1, value1, label2, value2, index) {
      const rowY = y + index * rowHeight;

      if (index !== 0) {
        doc.moveTo(leftX, rowY).lineTo(leftX + pageWidth, rowY).stroke();
      }

      doc.font("Helvetica-Bold").fontSize(10)
        .text(`${label1}:`, leftX + 5, rowY + 6);

      doc.font("Helvetica")
        .text(value1 || "-", leftX + 90, rowY + 6);

      doc.font("Helvetica-Bold")
        .text(`${label2}:`, leftX + pageWidth / 2 + 5, rowY + 6);

      doc.font("Helvetica")
        .text(value2 || "-", leftX + pageWidth / 2 + 90, rowY + 6);
    }

    row("Name", user.name, "Father Name", user.fatherName, 0);
    row("DOB", user.dob, "Gender", user.gender, 1);
    row("Category", user.category, "Mobile", user.mobile, 2);
    row("Email", user.email, "Marital Status", user.maritalStatus, 3);
    row("Home District", user.homeDistrict, "Merit No", user.meritNo, 4);

    doc.y = y + boxHeight + 30;

    // ================= SCHOOL TABLE =================
    doc.font("Helvetica-Bold").text("School Choices", { align: "center" });
    doc.moveDown();

    let startY = doc.y;
    let currentY = startY;
    const padding = 6;
    const textWidth = pageWidth / 2 - 90;

    for (let i = 0; i < schoolNames.length; i += 2) {
      const name1 = schoolNames[i] || "-";
      const name2 = schoolNames[i + 1] || "-";

      const h1 = doc.heightOfString(name1, { width: textWidth });
      const h2 = doc.heightOfString(name2, { width: textWidth });

      const rowH = Math.max(h1, h2) + padding * 2;

      if (i !== 0) {
        doc.moveTo(leftX, currentY).lineTo(leftX + pageWidth, currentY).stroke();
      }

      doc.font("Helvetica-Bold")
        .text(`Choice ${i + 1}:`, leftX + 5, currentY + padding);

      doc.font("Helvetica")
        .text(name1, leftX + 80, currentY + padding, { width: textWidth });

      if (schoolNames[i + 1]) {
        doc.font("Helvetica-Bold")
          .text(`Choice ${i + 2}:`, leftX + pageWidth / 2 + 5, currentY + padding);

        doc.font("Helvetica")
          .text(name2, leftX + pageWidth / 2 + 80, currentY + padding, {
            width: textWidth,
          });
      }

      currentY += rowH;
    }

    // OUTER BOX
    doc.rect(leftX, startY, pageWidth, currentY - startY).stroke();

    // CENTER LINE
    doc.moveTo(leftX + pageWidth / 2, startY)
      .lineTo(leftX + pageWidth / 2, currentY)
      .stroke();

    doc.y = currentY;

    // ================= SIGN =================
    doc.moveDown(3);
    const signX = doc.page.width - 200;

    doc.text("Candidate Signature", signX);
    doc.moveDown();
    doc.text(`Name: ${user.name}`, signX);
    doc.text(`Post: ${user.post}`, signX);
    doc.text(`Subject: ${user.subject}`, signX);
    doc.text(`Date: ${now.toLocaleDateString()}`, signX);

    // ================= SAVE =================
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        const fileName = `${user.post}_${user.subject}_${user.rollno}`
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "") + ".pdf";

        const pdfFolder = path.join(__dirname, "../pdfs");

        if (!fs.existsSync(pdfFolder)) {
          fs.mkdirSync(pdfFolder, { recursive: true });
        }

        const pdfPath = path.join(pdfFolder, fileName);
        fs.writeFileSync(pdfPath, pdfBuffer);

        const pdfUrl = `/pdfs/${fileName}`;

        user.pdfUrl = pdfUrl;
        user.formSubmitted = true;

        await user.save();

        res.json({
          message: "Form submitted successfully",
          pdfUrl,
        });

      } catch (err) {
        console.error("PDF ERROR:", err);
        res.status(500).json({ message: "Error generating PDF" });
      }
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  loginUser,
  getUser,
  getSchools,
  submitSchools,
  submitFinalForm,
};
