// models/Choice.js
import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  selectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Selections",
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  choices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    }
  ]
});

export default mongoose.model("Choice", choiceSchema);