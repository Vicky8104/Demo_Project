const express = require("express");

const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  getUser,
  getSchools,
  submitSchools,

  submitFinalForm

} = require("../controllers/authController");

const { verifyToken } = require("../middleware/verifyToken");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/user", verifyToken, getUser);

router.get("/schools", verifyToken, getSchools);

router.post("/submit-schools", verifyToken, submitSchools);

router.post("/submit-form", verifyToken, submitFinalForm);

module.exports = router;