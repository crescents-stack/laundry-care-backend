const express = require("express");
const router = express.Router();

// Imported individual route files
const usersRouter = require("./users/users.routes");
const adminRouter = require("./admin/admin.routes");
const shopsRouter = require("./shops/shops.routes");
const ridersRouter = require("./riders/riders.routes");
const { GetSecret } = require("../controllers/stripe.controller");
const ServicesRoutes = require("./services/services.routes");
const SchedulesRoute = require("./schedules/schedules.routes");

// Used the individual route files
router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.use("/shops", shopsRouter);
router.use("/riders", ridersRouter);
router.use("/services", ServicesRoutes)
router.use("/schedules", SchedulesRoute)

// stripe
router.post("/stripe/secret", GetSecret)

module.exports = router;
