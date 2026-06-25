import mongoose from "mongoose";
// const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "team", "candidate"],
    default: "candidate"
  },
  teamNumber: {
  type: Number
}

}, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);
export default User;
