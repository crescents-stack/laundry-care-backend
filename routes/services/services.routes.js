const express = require("express");
const authTokenMiddlewareAdmin = require("../../middlewares/admin/auth.token.middleware");
const {
  createService,
  getServices,
  deleteServices,
  updateService,
} = require("../../controllers/services/services.controller");
const ServicesRoutes = express.Router();

ServicesRoutes.post("/", authTokenMiddlewareAdmin, createService);
ServicesRoutes.get("/", getServices);
ServicesRoutes.put("/", authTokenMiddlewareAdmin, updateService);
ServicesRoutes.delete("/:_id", authTokenMiddlewareAdmin, deleteServices);

module.exports = ServicesRoutes;
