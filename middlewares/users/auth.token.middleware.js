// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../../models/users/users.model");
const config = require("../../config/config");

const authTokenMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization") || req.query.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.secretKey);
    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // console.error("Error in authentication middleware:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authTokenMiddleware;
