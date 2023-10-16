const mongoose = require("mongoose");
const ScheduleSchema = require("../../schemas/schedules/schedules.schema");
const OrdersModel = mongoose.model("Schedules", ScheduleSchema);
module.exports = OrdersModel;