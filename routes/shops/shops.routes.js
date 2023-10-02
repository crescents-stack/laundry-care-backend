const express = require("express");
const router = express.Router();

const {
  resetPassword,
  forgotPassword,
  register,
  login,
  updateShopData,
  deleteShopAccount,
  verification,
  verificationLetter,
  getShopData,
} = require("../../controllers/shop/shop.controller");
const { checkRole } = require("../../middlewares/users/auth.role.middleware");
const authTokenMiddleware = require("../../middlewares/shop/auth.token.middleware");

router.post("/register", checkRole("shop"), register);
router.post("/login", checkRole("shop"), login);
router.post(
  "/verification",
  checkRole("shop"),
  authTokenMiddleware,
  verification
);
router.post(
  "/verification-letter",
  checkRole("shop"),
  verificationLetter
);
router.post(
  "/forgot-password",
  checkRole("shop"),
  forgotPassword
);
router.post(
  "/reset-password",
  checkRole("shop"),
  authTokenMiddleware,
  resetPassword
);
router.get('/', checkRole("shop"), authTokenMiddleware, getShopData);
router.put("/", checkRole("shop"), authTokenMiddleware, updateShopData);
router.delete("/delete", checkRole("shop"), authTokenMiddleware, deleteShopAccount);
 
module.exports = router;
