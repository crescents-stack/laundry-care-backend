const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  nid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "shopOwner", "rider", "admin"],
    default: "rider", // Default role is set to "rider"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time when a rider is created
  },
  address: {
    type: String,
    required: false,
  },
  emailVerification: {
    type: Boolean,
    required: false,
  },
});

module.exports = riderSchema;
