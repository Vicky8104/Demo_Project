import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  userId: mongoose.Schema.Types.ObjectId,
  expiresAt: Date,
});

export default mongoose.model("Otp", otpSchema);
