const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes/router"); // Imported the root router
const config = require("./config/config");
const errorHandler = require("./utils/globalerrorhandler");

const { connectToDatabase } = require("./utils/mongodb.setup"); // Import the connectToDatabase function

connectToDatabase(); // Initialize the database connection

// Configured CORS to allow requests from the specified origins
app.use(
  cors({
    origin: config.allowedOrigins,
    methods: config.requestMethods,
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies (if needed)
app.use(express.urlencoded({ extended: true }));

// Used the root router
app.use("/api", router); // Add '/api' as a prefix to all routes
// Use the global error handler middleware
app.use(errorHandler);

// Started Express server here
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
