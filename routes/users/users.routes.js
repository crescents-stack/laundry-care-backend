const express = require('express');
const router = express.Router();

// Import necessary controllers
const { resetPassword, forgotPassword, register, login, updateUserData, deleteAccount, verification } = require('../../controllers/users/users.controller');
const { checkRole } = require('../../middlewares/users/auth.role.middleware');
const authTokenMiddleware = require('../../middlewares/users/auth.token.middleware');

// Route for user registration
router.post('/register', checkRole("user"),register);

// Route for user login
router.post('/login', checkRole("user"), login);
router.post('/forget-password', checkRole("user"), authTokenMiddleware, forgotPassword);
router.post('/reset-password', checkRole("user"), authTokenMiddleware, resetPassword);
router.put('/', checkRole("user"), authTokenMiddleware, updateUserData);
router.delete('/', checkRole("user"), authTokenMiddleware, deleteAccount);
router.get('/', checkRole("user"), authTokenMiddleware, deleteAccount);
router.post('/verification', checkRole("user"), authTokenMiddleware, verification);

// Define other user-related routes as needed

module.exports = router;
