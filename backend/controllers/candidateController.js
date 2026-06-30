import mongoose from "mongoose";
const Candidate = require("../models/Candidate");

exports.getMyProfile = async (req, res) => {
  try {
  const candidate = await Candidate.findOne({
  userId: req.user.id.toString()
});

        if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    return res.json({
      message: "Profile fetched successfully",
      data: candidate
    });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
};