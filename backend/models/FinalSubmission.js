// models/FinalSubmission.js
import mongoose from "mongoose";

const finalSubmissionSchema = new mongoose.Schema({
  selectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Selections",
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
  },
  email: String,
  post: String,
  area: String,
  subject: String,

  choices: [String],

  pdfUrl: String,

  status: {
    type: String,
    default: "submitted",
  },
}, { timestamps: true });

export default mongoose.model("FinalSubmission", finalSubmissionSchema);