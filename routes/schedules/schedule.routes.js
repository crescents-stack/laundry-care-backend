const express = require("express");
const { createSchedule } = require("../../controllers/schedules/schedules.controller");
const authTokenMiddleware = require("../../middlewares/users/auth.token.middleware");
const ScheduleRoutes = express.Router();

ScheduleRoutes.post("/schedule", authTokenMiddleware,createSchedule);

module.exports = ScheduleRoutes