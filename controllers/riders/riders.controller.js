const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Rider = require("../../models/riders/riders.model");
const { secretKey } = require("../../config/config");
const { sendEmail } = require("../../utils/nodemailer.setup");
const config = require("../../config/config");

// Register a new rider with email verification
exports.register = async (req, res) => {
  try {
    const { name, email, phone, nid, password, clientUrl } = req.body;

    // Check if the rider already exists by email
    const existingRiderByEmail = await Rider.findOne({ email });
    if (existingRiderByEmail) {
      return res
        .status(400)
        .json({ message: "Rider with this email already exists." });
    }

    // Check if the rider already exists by phone
    const existingRiderByPhone = await Rider.findOne({ phone });
    if (existingRiderByPhone) {
      return res
        .status(400)
        .json({ message: "Rider with this phone already exists." });
    }

    // Check if the rider already exists by NID
    const existingRiderByNID = await Rider.findOne({ nid });
    if (existingRiderByNID) {
      return res
        .status(400)
        .json({ message: "Rider with this NID already exists." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new rider instance with email verification status
    const newRider = new Rider({
      name,
      email,
      phone,
      nid,
      password: hashedPassword,
      role: "rider", // Default role is set to rider
      emailVerification: false, // Initialize email verification status
    });

    // Save the rider to the database
    await newRider.save();

    // Generate and send the email verification link
    const emailVerificationToken = generateEmailVerificationToken(newRider);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Rider registered successfully" });
  } catch (error) {
    console.error("Error in rider registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification token generation
function generateEmailVerificationToken(rider) {
  // Generate a JWT token with a short expiration time for email verification
  return jwt.sign({ riderId: rider._id }, secretKey, { expiresIn: "1h" });
}

// Login a rider
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the rider by email
    const rider = await Rider.findOne({ email });

    // Check if the rider exists and the password is correct
    if (!rider || !(await bcrypt.compare(password, rider.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the rider's email is verified
    if (!rider.emailVerification) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ riderId: rider._id, role: rider.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, rider });
  } catch (error) {
    console.error("Error in rider login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password: Send a password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    // Find the rider by email
    const rider = await Rider.findOne({ email });

    // Check if the rider exists
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Generate and send the password reset link
    const passwordResetToken = generatePasswordResetToken(rider);
    const passwordResetLink = `${clientUrl}?token=${passwordResetToken}`;

    await sendEmail(
      email,
      "Password Reset",
      `Click the following link to reset your password: ${passwordResetLink}`
    );

    res.status(201).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in sending password reset email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Password reset token generation
function generatePasswordResetToken(rider) {
  // Generate a JWT token with a short expiration time for password reset
  return jwt.sign({ riderId: rider._id }, secretKey, { expiresIn: "1h" });
}

// Reset Password: Update the password after clicking the reset link
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.header("Authorization").slice(7);

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the rider by rider ID
    const rider = await Rider.findById(decoded.riderId);

    // Check if the rider exists
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the rider's password
    rider.password = hashedPassword;

    // Save the updated rider to the database
    await rider.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification handler
exports.verification = async (req, res) => {
  const token = req.header("Authorization").slice(7);

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.secretKey); // Replace with your secret key

    // Find the rider based on the decoded token information
    const rider = await Rider.findById(decoded.riderId);

    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }

    // Update the emailVerification attribute to true
    rider.emailVerification = true;

    // Save the updated rider
    await rider.save();

    // Optionally, you can redirect the rider to a success page or send a success response
    res.status(200).send({ message: "Email verification successful" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

// Email verification (resend) handler
exports.verificationLatter = async (req, res) => {
  try {
    // Rider email
    const { email, clientUrl } = req.body;

    // Find the rider based on the email
    const rider = await Rider.findOne({ email });

    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }

    // Generate and send the email verification link
    const emailVerificationToken = generateEmailVerificationToken(rider);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Email verification link sent successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

// Get rider data by ID (protected route)
exports.getRiderData = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    // Decode the token
    const decoded = jwt.verify(token, secretKey);

    // Find the rider by rider ID
    const rider = await Rider.findById(decoded.riderId);

    // Check if the rider exists
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    res.status(200).json({ rider });
  } catch (error) {
    console.error("Error in getting rider data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update rider data (protected route)
exports.updateRiderData = async (req, res) => {
  try {
    const { name, address } = req.body;

    const token = req.header("Authorization").slice(7);

    // Decode the token
    const decoded = jwt.verify(token, secretKey);

    // Find the rider by rider ID
    const rider = await Rider.findById(decoded.riderId);

    // Check if the rider exists
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Update rider data
    rider.name = name;
    rider.address = address;

    // Save the updated rider to the database
    await rider.save();

    res.status(200).json({ message: "Rider data updated successfully" });
  } catch (error) {
    console.error("Error in updating rider data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete rider account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    // Decode the token
    const decoded = jwt.verify(token, secretKey);

    // Find the rider by rider ID
    const rider = await Rider.findById(decoded.riderId);

    // Check if the rider exists
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Find the rider by ID and remove it from the database
    const deletedRider = await Rider.findByIdAndRemove(rider._id);

    if (!deletedRider) {
      // If the rider doesn't exist, return a 404 response
      return res.status(404).json({ error: "Rider not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleting rider account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
