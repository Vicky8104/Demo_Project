
import mongoose from "mongoose";
// const mongoose = require("mongoose");

const selectionSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
      
    },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  email:{
    type:String,
    required:true
  },
  post: {
    type: String,
    required: true
  },
  area:{
    type:String,
    required:true
  },

  subject: {
    type: String,
    required: true
  },
  meritNo:{
    type:String,
    required:true
  },

  rollNo:{
    type:String,
    required:true
  },
  selCategory:{
    type:String,
    required:true
  },
  splCategory:{
    type:String,
    required:true
  },

  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // team user
  },
  shift:{
    type:String,
    required:true
  },

  dvDate: Date,


  status: {
    type: String,
    enum: ["Pending", "Submitted"],
    default: "Pending"
  },

  isLocked: { type: Boolean, default: false },

  selectedSchools: Array,
  pdfUrl: String

}, { timestamps: true });

// module.exports = mongoose.model("Selections", selectionSchema);
const Selection =  mongoose.model("Selection", selectionSchema);
export default Selection;