const express = require("express");
const router = express.Router();

const {
  resetPassword,
  forgotPassword,
  register,
  login,
  updateAdminData,
  deleteAccount,
  verification,
  verificationLatter,
  getAdminData,
} = require("../../controllers/admin/admin.controller");
const authTokenMiddleware = require("../../middlewares/admin/auth.token.middleware");
const checkRole = require("../../middlewares/users/auth.role.middleware");

router.post("/register", checkRole("admin"), register);
router.post("/login", checkRole("admin"), login);
router.post("/verification", checkRole("admin"), authTokenMiddleware, verification);
router.post("/verification-latter", checkRole("admin"), verificationLatter);
router.post("/forgot-password", checkRole("admin"), forgotPassword);
router.post("/reset-password", checkRole("admin"), authTokenMiddleware, resetPassword);
router.get("/", checkRole("admin"), authTokenMiddleware, getAdminData);
router.put("/", checkRole("admin"), authTokenMiddleware, updateAdminData);
router.delete("/delete", checkRole("admin"), authTokenMiddleware, deleteAccount);

module.exports = router;
