const jwt = require("jsonwebtoken");
const Rider = require("../../models/riders/riders.model"); // Import the Riders model
const config = require("../../config/config");

const authTokenMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization").slice(7) || req.query.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.secretKey);
    
    // Find the rider based on the decoded rider ID
    const rider = await Rider.findById(decoded.userId);

    if (!rider) {
      return res.status(401).json({ message: "Rider not found" });
    }

    // Attach the rider object to the request for further use
    req.rider = rider;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // console.error("Error in authentication middleware:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authTokenMiddleware;
