const User = require("../models/User");
const School = require("../models/School");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
// const cloudinary = require("cloudinary").v2; // ✅ ADDED
const cloudinary = require("../utils/cloudinary");

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

    doc.font("Helvetica-Bold").fontSize(25).text("Department of Sanskrit Education", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Counseling Application Form", { align: "center" });
    doc.moveDown();
    doc.text(`Post: ${user.post} | Subject: ${user.subject}`, { align: "center" });

    doc.moveDown(2);

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

    // row("Name", user.name, "Father Name", user.fatherName, 0);
    // row("DOB", user.dob, "Gender", user.gender, 1);
    // row("Category", user.category, "Mobile", user.mobile, 2);
    // row("Email", user.email, "Marital Status", user.maritalStatus, 3);
    // row("Home District", user.homeDistrict, "Merit No", user.meritNo, 4);
    
    row("Subject", user.subject, "Merit No", user.meritNo, 0)
    row("Name", user.name, "Father Name", user.fatherName, 1);
    row("DOB", user.dob, "Gender", user.gender, 2);
    row("Merital Status", user.maritalStatus, "Home District", user.homeDistrict,3);
    row("Category", user.category, "Selection Category", user.selectionCategory, 4);
    row("Special Category", user.specialCategory, "If Other", user.otherCategory,5)
    row("Mobile", user.mobile, "Email", user.email, 6);

    doc.y = y + boxHeight + 30;

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

    doc.rect(leftX, startY, pageWidth, currentY - startY).stroke();

    doc.moveTo(leftX + pageWidth / 2, startY)
      .lineTo(leftX + pageWidth / 2, currentY)
      .stroke();

    doc.y = currentY;

    doc.moveDown(3);
    const signX = doc.page.width - 200;

    doc.text("Candidate Signature", signX);
    doc.moveDown();
    doc.text(`Name: ${user.name}`, signX);
    doc.text(`Post: ${user.post}`, signX);
    doc.text(`Subject: ${user.subject}`, signX);
    doc.text(`Date: ${now.toLocaleDateString()}`, signX);

    // ================= SAVE (CLOUDINARY) =================
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        const fileName = `${user.post}_${user.subject}_${user.rollno}`
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "") + ".pdf";

        // TEMP FILE
        const tempPath = path.join(__dirname, fileName);
        fs.writeFileSync(tempPath, pdfBuffer);

        // UPLOAD
        const result = await cloudinary.uploader.upload(tempPath, {
          resource_type: "raw",
          folder: "pdfs",
          public_id: fileName.replace(".pdf", "")
        });

        // DELETE TEMP
        fs.unlinkSync(tempPath);

        const pdfUrl = result.secure_url;

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


