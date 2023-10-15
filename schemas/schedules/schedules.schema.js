const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  services: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shops",
        required: true,
      },
      service: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
    },
  ],
  shop: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Shops", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  rider: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Shops", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  collection: {
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  delivery: {
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  payment: {
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  progress: {
    type: String,
    required: true,
    enum: ["DONE", "PENDING", "PROCESSING"],
    default: "PENDING",
  },
});

module.exports = ScheduleSchema;
