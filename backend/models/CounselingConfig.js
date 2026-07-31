import mongoose from "mongoose";
const configSchema  = new mongoose.Schema({
  post: String,
  area: String,
  subject: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, {timestamps:true});

export default mongoose.model("CounselingConfig", configSchema);