<<<<<<< HEAD
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   post: String,
//   subject: String,
//   meritNo: String,
//   rollno: String, 
//   name: String,
//   fatherName: String,
//   gender: String,
//   dob: String,
//   maritalStatus: String,
//   homeDistrict: String,
//   category: String,
//   selectionCategory: String,
//   specialCategory: String,
//   otherCategory: String,
//   mobile: String,
//   email: String,
//   otp: String,
//   otpExpiry: Date,
//   schoolChoices: [String],
// });

// // 👇 Explicit collection name
// module.exports = mongoose.model("User", userSchema, "users");

=======
>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  post: String,
  subject: String,
  meritNo: String,
<<<<<<< HEAD
  rollno: String,
=======
  rollno: String, 
>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
  name: String,
  fatherName: String,
  gender: String,
  dob: String,
<<<<<<< HEAD

=======
>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
  maritalStatus: String,
  homeDistrict: String,
  category: String,
  selectionCategory: String,
  specialCategory: String,
  otherCategory: String,
<<<<<<< HEAD

  mobile: String,
  email: String,

  otp: String,
  otpExpiry: Date,

  schoolChoices: [String],

  pdfUrl: String,
  formSubmitted: { type: Boolean, default: false }

});

module.exports = mongoose.model("User", userSchema, "users");
=======
  mobile: String,
  email: String,
  otp: String,
  otpExpiry: Date,
  schoolChoices: [String],
});

// 👇 Explicit collection name
module.exports = mongoose.model("User", userSchema, "users");
>>>>>>> e0e39ce85a499e87c9ea036bbc2c41883874a7da
