import express from "express";
// const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/candidateController");

// 👤 logged in candidate profile
router.get("/my-profile", authMiddleware, getMyProfile);

module.exports = router;



