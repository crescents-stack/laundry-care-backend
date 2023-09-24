// config.js
require("dotenv").config();
module.exports = {
  secretKey: process.env.SECRET_KEY, // Use the environment variable if available, or a default value
  databaseUrl: process.env.DATABASE_URL, // MongoDB connection URL
  port: process.env.PORT, // Port for the Express.js server
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(","),
  requestMethods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  nodemailerEmail: process.env.NODEMAILER_USER,
  nodemailerPassword: process.env.NODEMAILER_PASS,
  nodemailerService: process.env.NODEMAILER_SERVICE,
  nodemailerFrom: process.env.NODEMAILER_FROM,
};
