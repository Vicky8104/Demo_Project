const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Selection = require("../models/Selections");

router.get("/my-candidates", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "team") {
      return res.status(403).json({ message: "Team only" });
    }

    // console.log("USER:", req.user);

    // 🔥 string → ObjectId conversion
    const teamId = new mongoose.Types.ObjectId(req.user.id);

    const selections = await Selection.find({
      assignedTeam: teamId   // ✅ exact match
    })
    .populate("candidateId", "name email"); // sirf required fields

    console.log("FOUND:", selections.length);

    res.json(selections);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;