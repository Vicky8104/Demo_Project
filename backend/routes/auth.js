<<<<<<< HEAD
// const express = require("express");

// const router = express.Router();

// const {
//   sendOtp,
//   verifyOtp,
//   getUser,
//   getSchools,
//   submitSchools,
// } = require("../controllers/authController");

// const { verifyToken } = require("../middleware/verifyToken");

// // OTP routes
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);

// // Protected routes
// router.get("/user/:id", verifyToken, getUser);
// router.get("/schools", verifyToken, getSchools);
// router.post("/submit-schools", verifyToken, submitSchools);

// module.exports = router;

const express = require("express");
=======
const express = require("express");

>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  getUser,
  getSchools,
  submitSchools,
<<<<<<< HEAD
  submitFinalForm
=======
>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
} = require("../controllers/authController");

const { verifyToken } = require("../middleware/verifyToken");

<<<<<<< HEAD
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/user/:id", verifyToken, getUser);

router.get("/schools", verifyToken, getSchools);

router.post("/submit-schools", verifyToken, submitSchools);

router.post("/submit-form", verifyToken, submitFinalForm);

=======
// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Protected routes
router.get("/user/:id", verifyToken, getUser);
router.get("/schools", verifyToken, getSchools);
router.post("/submit-schools", verifyToken, submitSchools);

>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
module.exports = router;