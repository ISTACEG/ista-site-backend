const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    roll: { type: String, unique: true, required: true },
    student_mail: { type: String, unique: true, required: true },
    year: { type: Number, required: true },
    personal_mail: { type: String, default: null },
    password: { type: String, default: null },
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
