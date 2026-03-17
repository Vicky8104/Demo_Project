const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: String,
  code: String,
  post: String,
  subject: String,
});

module.exports = mongoose.model("School", schoolSchema);
