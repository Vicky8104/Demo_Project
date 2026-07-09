import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import School from "../models/School.js";
import Selection from "../models/Selections.js";
import FinalSubmission from "../models/FinalSubmission.js";


// ✅ Dashboard
router.get("/dashboard", protect, isAdmin, (req, res) => {
  //   console.log("===== ADMIN DASHBOARD HIT =====");

  // console.log("AUTH HEADER:", req.headers.authorization); // 🔥
  // console.log("REQ.USER:", req.user); // 🔥
  res.json({ message: "Admin Dashboard Data" });
});


// ✅ All Candidates
router.get("/candidates", protect, isAdmin, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Users
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Schools
router.get("/schools", protect, isAdmin, async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Selections
router.get("/selections", protect, isAdmin, async (req, res) => {
  try {
    const selections = await Selection.find()
      .populate("candidateId", "name email");

    res.json(selections);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Report API
router.get("/report", protect, isAdmin, async (req, res) => {
  try {
    const selectionData = await Selection.aggregate([
      {
        $group: {
          _id: {
            post: "$post",
            area: "$area",
            subject: "$subject"
          },
          totalSelections: { $sum: 1 }
        }
      }
    ]);

    const submissionData = await FinalSubmission.aggregate([
      {
        $group: {
          _id: {
            post: "$post",
            area: "$area",
            subject: "$subject"
          },
          submitted: {
            $sum: {   $cond: [{ $eq: ["$status", "submitted"] }, 1, 0]}
          },
          pending: {
            $sum: { $cond: ["$isSubmitted", 0, 1] }
          }
        }
      }
    ]);

    const finalReport = selectionData.map(sel => {
      const match = submissionData.find(sub =>
        sub._id.post === sel._id.post &&
        sub._id.area === sel._id.area &&
        sub._id.subject === sel._id.subject
      );

      const submitted = match?.submitted || 0;
      const totalSelections = sel.totalSelections;
      const pending = totalSelections - submitted;

      return {
        post: sel._id.post,
        area: sel._id.area,
        subject: sel._id.subject,
        totalSelections,
        submitted,
        pending

      };
    });

    res.json(finalReport);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ FINAL EXPORT
export default router;
