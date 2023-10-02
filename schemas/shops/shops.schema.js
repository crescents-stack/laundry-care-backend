const mongoose = require("mongoose");
 
const shopSchema = new mongoose.Schema({
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
    enum: ["user", "shop", "rider", "admin"],
    default: "shop", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
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

module.exports = shopSchema;
