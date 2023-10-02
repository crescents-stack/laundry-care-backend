const jwt = require("jsonwebtoken");
const Shop = require("../../models/shops/shops.model");
const config = require("../../config/config");

const authTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").slice(7) || req.query.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, config.secretKey);
    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(401).json({ message: "Shop not found" });
    }
 
    req.shop = shop;
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authTokenMiddleware;
