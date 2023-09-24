// userSchema.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time when a user is created
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

module.exports = userSchema;
