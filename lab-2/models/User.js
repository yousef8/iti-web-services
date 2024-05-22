const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  age: { type: Number },
  role: { type: String, enum: ["ADMIN", "USER", "GUEST"], default: "USER" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
