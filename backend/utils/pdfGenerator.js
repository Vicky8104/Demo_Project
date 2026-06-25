import PDFDocument from "pdfkit";

export const createPDF = ({ candidate, selectionData, choices }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 40, left: 40, right: 40, bottom: 20 } // ✅ FIXED
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ================= HEADER =================
      const drawHeader = () => {
        doc
          .fontSize(18)
          .font("Helvetica-Bold")
          .text("SANSKRIT EDUCATION DEPARTMENT", 0, 20, { align: "center" });

        doc.moveTo(40, 55).lineTo(555, 55).stroke();

        doc
          .fontSize(13)
          .font("Helvetica-Bold")
          .text("COUNSELING APPLICATION FORM", 0, 65, {
            align: "center",
          });

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `(Post: ${selectionData.post} | Area: ${selectionData.area} | Subject: ${selectionData.subject} | ${selectionData.meritNo} | ${selectionData.rollNo})`,
            0,
            85,
            { align: "center" }
          );

        doc.moveTo(40, 105).lineTo(555, 105).stroke();
      };

      const addNewPage = () => {
        doc.addPage();
        drawHeader();
      };

      drawHeader();

      let y = 120;

      // ================= PERSONAL DETAILS =================
      const startY = y; // ✅ FIX

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("PERSONAL DETAILS", 40, y + 8, {
          width: 515,
          align: "center",
        });

      y += 30;

      const col1 = 50;
      const col2 = 300;
      const gap = 22;

      const labelWidth1 = 90;
      const labelWidth2 = 110;


      const row = (l1, v1, l2, v2) => {
        doc.fontSize(10);

        if (l1) {
          doc.font("Helvetica-Bold").text(`${l1}:`, col1, y, {
            width: labelWidth1,
          });

          doc.font("Helvetica").text(v1 || "", col1 + labelWidth1, y);
        }

        if (l2) {
          doc.font("Helvetica-Bold").text(`${l2}:`, col2, y, {
            width: labelWidth2,
          });

          doc.font("Helvetica").text(v2 || "", col2 + labelWidth2, y);
        }

        y += gap;
      };

      // row("Post & Area", selectionData.post, "Area", selectionData.area);
      // row("Subject", selectionData.subject, "Merit No", selectionData.meritNo);
      // row("Roll No", selectionData.rollNo, "", "");

      // row("Name", candidate.name, "Father Name", candidate.fatherName);
      // row("DOB", candidate.dob, "Gender", candidate.gender);
      // row("Marital Status", candidate.maritalStatus, "Home District", candidate.homeDistrict);
      // row("Category", candidate.category, "Selection Category", selectionData.selCategory);
      // row("Special Category", selectionData.splCategory, "Mobile No", candidate.mobile);
      // row("Email", candidate.email, "", "");
      // row("If Other", candidate.ifOther, "", "");

      row("Post & Area", `${selectionData.post} & ${selectionData.area}`,"Subject", selectionData.subject);
      row("Merit No", selectionData.meritNo,"Roll No", selectionData.rollNo);
      row("Name", candidate.name, "Father Name", candidate.fatherName);
      row("DOB", candidate.dob, "Gender", candidate.gender);
      row("Marital Status", candidate.maritalStatus, "Home District", candidate.homeDistrict);
      row("Category", candidate.category, "Selection Category", selectionData.selCategory);
      row("Special Category", selectionData.splCategory, "Mobile No", candidate.mobile);
      row("Email", candidate.email,"", "");
      row("If Other", candidate.ifOther,"","");

      // ✅ DRAW BOX AFTER CONTENT (FIX)
      const boxHeight = y - startY + 10;
      doc
        .rect(40, startY, 515, boxHeight)
        .lineWidth(1)
        .stroke();

      y += 20;

      // ================= SCHOOL CHOICES =================
      if (y > 700) {
        addNewPage();
        y = 120;
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("CHOICE OF SCHOOLS", 45, y + 8, { align: "center" });

      y += 30;

      // const colX = [50, 130];
      // const colWidth = [80, 400];
      const colX = [40, 120];
      const colWidth = [80, 435]

      const drawTableHeader = () => {
        doc.font("Helvetica-Bold");

        doc.rect(colX[0], y, colWidth[0], 25).stroke();
        doc.text("Choice No", colX[0] + 10, y + 8);

        doc.rect(colX[1], y, colWidth[1], 25).stroke();
        doc.text("Selected School", colX[1] + 10, y + 8);

        y += 25;
      };

      drawTableHeader();

      choices.forEach((schoolName, i) => {
        if (y > 720) {
          addNewPage();
          y = 120;

          doc
            .font("Helvetica-Bold")
            .text("CHOICE OF SCHOOLS (Continued)", 50, y);

          y += 20;
          drawTableHeader();
        }

        doc.font("Helvetica");

        doc.rect(colX[0], y, colWidth[0], 25).stroke();
        doc.text(String(i + 1), colX[0] + 25, y + 8);

        doc.rect(colX[1], y, colWidth[1], 25).stroke();
        doc.text(schoolName || "N/A", colX[1] + 10, y + 8);

        y += 25;
      });

      y += 40;

      // ================= SIGNATURE =================
      if (y > 750) {
        addNewPage();
        y = 120;
      }

      doc.font("Helvetica");

      // doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, y);
      // doc.text("Candidate Signature: ____________________", 350, y);

      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, y);
      doc.text(`Time: ${new Date().toLocaleTimeString()}`, 50, y + 20);

      doc.text("Candidate Signature: ____________________", 320, y);
      doc.text(`${candidate.name}`, 380, y + 20);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
