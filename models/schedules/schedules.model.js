const mongoose = require("mongoose");
const ScheduleSchema = require("../../schemas/schedules/schedules.schema");
const ScheduleModel = mongoose.model("Schedules", ScheduleSchema);
module.exports = ScheduleModel;