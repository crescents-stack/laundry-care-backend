const mongoose = require("mongoose");
const ServicesSchema = new mongoose.Schema({
  service: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  included: [
    {
      type: String,
      required: false,
    },
  ],
  serivceTime: {type: Number, required: true},
  items: [
    {
      type: String,
      required: false,
    },
  ],
});

module.exports = ServicesSchema;
