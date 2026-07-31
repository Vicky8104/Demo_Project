// models/FinalSubmission.js
import mongoose from "mongoose";

const finalSubmissionSchema = new mongoose.Schema({
  selectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Selections",
  },
  name: String,
  fatherName: String,
  dob: String,
  gender: String,
  maritalStatus: String,
  homeDistrict: String,
  category: String,
  email: String,
  mobile: String,
  ifOther: String,
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
  },
  email: String,
  post: String,
  area: String,
  subject: String,
  rollNo: String,
  meritNo: String,
  selCategory: String,
  splCategory: String,



  choices: [String],

  pdfUrl: String,

  status: {
    type: String,
    default: "submitted",
  },
}, { timestamps: true });


export default mongoose.model("FinalSubmission", finalSubmissionSchema);