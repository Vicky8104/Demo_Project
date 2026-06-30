// models/School.js
// const mongoose = require("mongoose");
import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
  code:Number,
  schoolName: String,
  post: String,
  subject: String,
  area:String

}, { timestamps: true });


const School = mongoose.model("School", schoolSchema);

export default School;

// module.exports = mongoose.model("School", schoolSchema);
