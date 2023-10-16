const express = require("express");
const {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} = require("../../controllers/schedules/schedules.controller");
const authTokenMiddlewareUsers = require("../../middlewares/users/auth.token.middleware");
const authTokenMiddlewareRider = require("../../middlewares/riders/auth.token.middleware");
const authTokenMiddlewareShop = require("../../middlewares/shops/auth.token.middleware");
const authTokenMiddlewareAdmin = require("../../middlewares/admin/auth.token.middleware");
const {checkRole} = require("../../middlewares/users/auth.role.middleware");
const SchedulesRoute = express.Router();


SchedulesRoute.post("/", createSchedule);
SchedulesRoute.get("/user", authTokenMiddlewareUsers, checkRole("user"), getSchedules);
SchedulesRoute.get("/rider", authTokenMiddlewareRider, checkRole("rider"), getSchedules);
SchedulesRoute.get("/shop", authTokenMiddlewareShop, checkRole("shop"), getSchedules);
SchedulesRoute.get("/admin", authTokenMiddlewareAdmin, checkRole("admin"), getSchedules);
SchedulesRoute.put("/", updateSchedule);
SchedulesRoute.delete("/", deleteSchedule);


module.exports = SchedulesRoute;
