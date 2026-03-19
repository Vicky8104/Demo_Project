const User = require("../models/User");
const School = require("../models/School");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/Mailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ================= OTP generator =================
function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

// =================================================
// 🚀 SEND OTP (CASE-INSENSITIVE MATCH)
// =================================================

async function sendOtp(req, res) {
  try {
    const { post, subject, rollno, email } = req.body;

    console.log("REQ BODY:", req.body);

    // DB me user search
    const user = await User.findOne({
      post: post,
      subject: subject,
      rollno: rollno,
      email: email.toLowerCase() // lowercase ensure
    });


    // console.log("FOUND USER:", user);

    console.log("FOUND USER:", user);


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ OTP generate karo
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    console.log("Sending OTP to:", user.email, "OTP:", otp);

    // OTP email bhejo
    await sendOTPEmail(user.email, otp);
    console.log("OTP sent successfully!");

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


// =================================================
// 🚀 VERIFY OTP (CASE-INSENSITIVE MATCH)
// =================================================
async function verifyOtp(req, res) {
  try {
    const { post, subject, email, otp } = req.body;

    const user = await User.findOne({
      post: post,
      subject: { $regex: `^${subject}$`, $options: "i" },
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // ================= JWT TOKEN =================
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        post: user.post,
        subject: user.subject,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   res.status(200).json({
  message: "OTP verified successfully",
  token,
  user
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================================================
// GET PERSONAL DETAILS
// =================================================
async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
      .select("-otp -otpExpiry");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// =================================================
// GET SCHOOLS (POST + SUBJECT BASED)
// =================================================
// async function getSchools(req, res) {
//   try {
//     const { post, subject } = req.query;

//     const schools = await School.find({
//       post,
//       subject: { $regex: `^${subject}$`, $options: "i" },
//     });

//     res.status(200).json({ schools });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }
async function getSchools(req, res) {
  try {

    const { post, subject } = req.query;

    const schools = await School.find({
      post,
      subject: { $regex: `^${subject}$`, $options: "i" },
    });

    res.status(200).json({ schools });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
// =================================================
// SAVE SCHOOL CHOICES
// =================================================
async function submitSchools(req, res) {
  try {
    const { selectedSchools } = req.body;

    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.formSubmitted ) {
      return res.status(403).json({ message: "Form locked after final submission"});
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

async function submitFinalForm(req, res) {

  try {

    const { personalData, schoolData, schoolNames } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     if (user.formSubmitted) {
      return res.status(403).json({ message: "Form already submitted. You cannot submit again"});
     }

    user.maritalStatus = personalData.maritalStatus;
    user.homeDistrict = personalData.homeDistrict;
    user.otherCategory = personalData.otherCategory;

    user.schoolChoices = schoolData;

    const pdfFolder = path.join(__dirname, "../pdfs");

    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder);
    }

    const pdfPath = path.join(pdfFolder, `${user._id}.pdf`);

    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(fs.createWriteStream(pdfPath));

    const leftX = 40;
    const rightX = 300;

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    let y = doc.y;

    // ================= HEADER =================

    doc.font("Helvetica-Bold")
      .fontSize(25)
      .text("Department of Sanskrit Education", 0, y, { align: "center" });
    doc.moveDown(0.3);
    doc.moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    doc.moveDown(0.5);
    doc.fontSize(16)
    doc.text("Counseling Application Form", { align: "center" });

    // doc.fontSize(16)
    //   .text(`${user.post} ${user.subject} Counseling Form`, {
    //     align: "center"
    //   });

    doc.moveDown(0.3);
    doc.text(`Post: ${user.post} | Subject: ${user.subject}`, {
      align: "center",
    fontSize: 12
    });
    // doc.font("Helvetica-Bold")
    //   .fontSize(12)
    //   .text(`Post: ${user.post}`, leftX);

    // doc.text(`Subject: ${user.subject}`, rightX, doc.y - 14);

    doc.moveDown(2);

    // ================= PERSONAL DETAILS =================

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .text("PERSONAL DETAILS", 0, doc.y, { align: "center" });

    doc.moveDown(0.5);

    y = doc.y;

    const rowHeight = 24;
    const totalRows = 5;
    const boxHeight = rowHeight * totalRows;

    // Outer box
    doc.rect(leftX, y, pageWidth, boxHeight).stroke();

    // Middle vertical line
    doc.moveTo(leftX + pageWidth / 2, y)
      .lineTo(leftX + pageWidth / 2, y + boxHeight)
      .stroke();

    function row(label1, value1, label2, value2, index) {

      const rowY = y + index * rowHeight;

      // Horizontal lines
      if (index !== 0) {
        doc.moveTo(leftX, rowY)
          .lineTo(leftX + pageWidth, rowY)
          .stroke();
      }

      // Left side
      doc.font("Helvetica-Bold")
        .fontSize(10)
        .text(`${label1}:`, leftX + 5, rowY + 6);

      doc.font("Helvetica")
        .text(value1 || "-", leftX + 90, rowY + 6);

      // Right side
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

    doc.moveDown(2);

    // ================= SCHOOL CHOICES =================

    doc.y = y + boxHeight + 30;

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .text("School Choices", 0, doc.y, { align: "center" });

    doc.moveDown(0.5);

    let schoolTop = doc.y;

    const choiceRowHeight = 24;
    const totalRowsChoice = Math.ceil(schoolNames.length / 2);
    const schoolBoxHeight = totalRowsChoice * choiceRowHeight;

    // Outer box
    doc.rect(leftX, schoolTop, pageWidth, schoolBoxHeight).stroke();

    // Middle vertical line
    doc.moveTo(leftX + pageWidth / 2, schoolTop)
      .lineTo(leftX + pageWidth / 2, schoolTop + schoolBoxHeight)
      .stroke();

    for (let i = 0; i < schoolNames.length; i += 2) {

      const rowIndex = Math.floor(i / 2);
      const rowY = schoolTop + rowIndex * choiceRowHeight;

      // Horizontal lines
      if (rowIndex !== 0) {
        doc.moveTo(leftX, rowY)
          .lineTo(leftX + pageWidth, rowY)
          .stroke();
      }

      const name1 = schoolNames[i];
      const name2 = schoolNames[i + 1];

      // Left
      doc.font("Helvetica-Bold")
        .fontSize(10)
        .text(`Choice ${i + 1}:`, leftX + 5, rowY + 6);

      doc.font("Helvetica")
        .text(name1 || "-", leftX + 80, rowY + 6, {
          width: pageWidth / 2 - 90
        });

      // Right
      if (name2) {
        doc.font("Helvetica-Bold")
          .text(`Choice ${i + 2}:`, leftX + pageWidth / 2 + 5, rowY + 6);

        doc.font("Helvetica")
          .text(name2, leftX + pageWidth / 2 + 80, rowY + 6, {
            width: pageWidth / 2 - 90
          });
      }
    }

    // ================= SIGNATURE =================

    doc.moveDown(4);

    const signX = doc.page.width - 200;

    doc.font("Helvetica-Bold")
      .text("Candidate Signature", signX);

    doc.moveDown();

    doc.font("Helvetica")
      .text(`Name: ${user.name}`, signX)
      .text(`Post: ${user.post}`, signX)
      .text(`Subject: ${user.subject}`, signX);

    const now = new Date();

    doc.text(
      `Date: ${now.toLocaleDateString()}`,
      signX
    );

    doc.end();

    user.pdfUrl = `/pdfs/${user._id}.pdf`;
    user.formSubmitted = true;

    await user.save();

    res.json({
      message: "Form submitted successfully",
      pdfUrl: user.pdfUrl
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: "Server error" });

  }

}

module.exports = {
  sendOtp,
  verifyOtp,
  getUser,
  getSchools,
  submitSchools,

  submitFinalForm,
};
