import Selection from "../models/Selections.js";
import axios from "axios";

export const downloadPdf = async (req, res) => {
  try {
    console.log("==== DOWNLOAD API HIT ====");

    const userId = req.user.id;
    const role = req.user.role;
    const selectionId = req.params.id;

    console.log("User ID:", userId);
    console.log("Role:", role);
    console.log("Selection ID:", selectionId);

    // 🔍 DB fetch
    const selection = await Selection.findById(selectionId);

    console.log("DB Record:", selection);

    if (!selection) {
      console.log("❌ No record found");
      return res.status(404).json({ message: "PDF not found" });
    }

    console.log("DB userId:", selection.userId);
    console.log("Logged userId:", userId);

    // 🔐 Access control (FIXED)
    if (role !== "admin") {
      if (selection.userId.toString() !== userId) {
        console.log("❌ Unauthorized access");
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    console.log("PDF URL:", selection.pdfUrl);

    if (!selection.pdfUrl) {
      console.log("❌ PDF not generated yet");
      return res.status(404).json({ message: "PDF not available" });
    }

    console.log("➡️ Fetching PDF...");

    const response = await axios.get(selection.pdfUrl, {
      responseType: "stream"
    });

    console.log("✅ PDF fetched");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=application.pdf"
    );

    response.data.pipe(res);

  } catch (err) {
    console.error("🔥 Download error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
