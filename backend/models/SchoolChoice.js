// models/SchoolChoice.js
import mongoose from "mongoose";

const schoolChoiceSchema = new mongoose.Schema({

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },

  selectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Selection",
    required: true
  },

  choices: [
    {
      schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
      },
      priority: Number
    }
  ],

  submittedAt: Date

}, { timestamps: true });

export default mongoose.model("SchoolChoice", schoolChoiceSchema);