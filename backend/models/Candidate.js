
import mongoose from "mongoose";
// const mongoose = require ("mongoose");

const candidateSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    
  },

  name: String,
  fatherName: String,
  mobile: String,
  email: String,
  gender:String,
  maritalStatus:String,
  dob: String,
  homeDistrict:String,
  category:String,
  ifOther:String



}, { timestamps: true });

// module.exports = mongoose.model("Candidate", candidateSchema);
const Candidate =  mongoose.model("Candidate", candidateSchema);
export default Candidate;