const express = require("express");
const router = express.Router();

// Import necessary controllers
const {
  resetPassword,
  forgotPassword,
  register,
  login,
  updateUserData,
  deleteAccount,
  verification,
  verificationLatter,
  getUserData,
} = require("../../controllers/users/users.controller");
const { checkRole } = require("../../middlewares/users/auth.role.middleware");
const authTokenMiddleware = require("../../middlewares/users/auth.token.middleware");

router.post("/register", checkRole("user"), register);
router.post("/login", checkRole("user"), login);
router.post(
  "/verification",
  checkRole("user"),
  authTokenMiddleware,
  verification
);

router.post("/verification-latter", checkRole("user"), verificationLatter);
router.post(
  "/forget-password",
  checkRole("user"),
  forgotPassword
);
router.post(
  "/reset-password",
  checkRole("user"),
  authTokenMiddleware,
  resetPassword
);
router.get('/', checkRole("user"), authTokenMiddleware, getUserData);
router.put("/", checkRole("user"), authTokenMiddleware, updateUserData);
router.delete("/delete", checkRole("user"), authTokenMiddleware, deleteAccount);

module.exports = router;
