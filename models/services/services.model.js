const mongoose = require("mongoose");
const ServicesSchema = require("../../schemas/services/services.schema");
const ServicesModel = mongoose.model("Services", ServicesSchema);
module.exports = ServicesModel;