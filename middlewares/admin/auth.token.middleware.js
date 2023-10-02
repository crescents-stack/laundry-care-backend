const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admins.model");
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
    const admin = await Admin.findById(decoded.userId);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authTokenMiddleware;
