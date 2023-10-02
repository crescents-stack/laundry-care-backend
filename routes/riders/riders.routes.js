const express = require("express");
const router = express.Router();

// Import necessary controllers for Riders
const {
  resetPassword,
  forgotPassword,
  register,
  login,
  updateRiderData,
  deleteRiderAccount,
  verification,
  verificationLetter,
  getRiderData,
} = require("../../controllers/riders/riders.controller"); // Update the controller imports
const { checkRole } = require("../../middlewares/riders/auth.role.middleware"); // Update the middleware import
const authTokenMiddleware = require("../../middlewares/riders/auth.token.middleware"); // Update the middleware import

router.post("/register", checkRole("rider"), register); // Update the role to "rider"
router.post("/login", checkRole("rider"), login); // Update the role to "rider"
router.post(
  "/verification",
  checkRole("rider"),
  authTokenMiddleware,
  verification
);
router.post("/verification-letter", checkRole("rider"), verificationLetter); // Update the route
router.post(
  "/forgot-password",
  checkRole("rider"),
  forgotPassword
);
router.post(
  "/reset-password",
  checkRole("rider"),
  authTokenMiddleware,
  resetPassword
);
router.get("/", checkRole("rider"), authTokenMiddleware, getRiderData); // Update the route
router.put("/", checkRole("rider"), authTokenMiddleware, updateRiderData); // Update the route
router.delete("/delete", checkRole("rider"), authTokenMiddleware, deleteRiderAccount); // Update the route

module.exports = router;
