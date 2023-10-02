// controllers/users/userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/users/users.model");
const { secretKey } = require("../../config/config");
const { sendEmail } = require("../../utils/nodemailer.setup");
const config = require("../../config/config");
// Import the sendEmail function

// Register a new user with email verification
exports.register = async (req, res) => {
  try {
    const { name, email, phone, nid, password, clientUrl } = req.body;

    // Check if the user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Check if the user already exists by phone
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "User with this phone already exists." });
    }

    // Check if the user already exists by NID
    const existingUserByNID = await User.findOne({ nid });
    if (existingUserByNID) {
      return res
        .status(400)
        .json({ message: "User with this NID already exists." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with email verification status
    const newUser = new User({
      name,
      email,
      phone,
      nid,
      password: hashedPassword,
      role: "user",
      emailVerification: false, // Initialize email verification status
    });

    // Save the user to the database
    await newUser.save();

    // Generate and send the email verification link
    const emailVerificationToken = generateEmailVerificationToken(newUser);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification token generation (you need to implement this)
function generateEmailVerificationToken(user) {
  // Generate a JWT token with a short expiration time for email verification
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
}

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user's email is verified
    if (!user.emailVerification) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password: Send a password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and send the password reset link (you need to implement this)
    const passwordResetToken = generatePasswordResetToken(user);
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

// Reset Password: Update the password after clicking the reset link
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.header("Authorization").slice(7);

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verification = async (req, res) => {
  const token = req.header("Authorization").slice(7);

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.secretKey); // Replace with your secret key

    // Find the user based on the decoded token information
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the emailVerification attribute to true
    user.emailVerification = true;

    // Save the updated user
    await user.save();

    // Optionally, you can redirect the user to a success page or send a success response
    res.status(200).send({ message: "Email verification successful" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

exports.verificationLatter = async (req, res) => {
  try {
    // user email
    const { email, clientUrl } = req.body;

    // Find the user based on the decoded token information
    const user = await User.find({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and send the email verification link
    const emailVerificationToken = generateEmailVerificationToken(user[0]);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

// Password reset token generation (you need to implement this)
function generatePasswordResetToken(user) {
  // Generate a JWT token with a short expiration time for password reset
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
}

// Get user data by ID (protected route)
exports.getUserData = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getting user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user data (protected route)
exports.updateUserData = async (req, res) => {
  try {
    const { name, address} = req.body;

    const token = req.header("Authorization").slice(7);

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    user.name = name;
    user.address = address;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error in updating user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user by ID and remove it from the database
    const deletedUser = await User.findByIdAndRemove(user._id);

    if (!deletedUser) {
      // If the user doesn't exist, return a 404 response
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in deleting user account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
