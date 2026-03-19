
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

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  post: String,
  subject: String,
  meritNo: String,
  rollno: String,
  name: String,
  fatherName: String,
  gender: String,
  dob: String,


  maritalStatus: String,
  homeDistrict: String,
  category: String,
  selectionCategory: String,
  specialCategory: String,
  otherCategory: String,

  mobile: String,
  email: String,

  otp: String,
  otpExpiry: Date,

  schoolChoices: [String],

  pdfUrl: String,
  formSubmitted: { type: Boolean, default: false }

});

module.exports = mongoose.model("User", userSchema, "users");
