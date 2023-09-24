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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
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

// Rest of the user controller functions (login, protected routes, etc.) remain unchanged

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
    if (!user.isEmailVerified) {
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
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and send the password reset link (you need to implement this)
    const passwordResetToken = generatePasswordResetToken(user);
    const passwordResetLink = `https://yourwebsite.com/reset-password?token=${passwordResetToken}`;

    await sendEmail(
      email,
      "Password Reset",
      `Click the following link to reset your password: ${passwordResetLink}`
    );

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in sending password reset email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password: Update the password after clicking the reset link
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Decode the password reset token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by user ID
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
  const token = req.query.token; // Assuming the token is sent as a URL parameter
  
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


// Rest of the code (register, protected routes, etc.) remains unchanged

// Password reset token generation (you need to implement this)
function generatePasswordResetToken(user) {
  // Generate a JWT token with a short expiration time for password reset
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
}

// Get user data by ID (protected route)
exports.getUserData = async (req, res) => {
  try {
    const userId = req.userId; // Extract user ID from JWT token

    // Find the user by ID
    const user = await User.findById(userId);

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
    const userId = req.userId; // Extract user ID from JWT token
    const { name, email, phone, nid } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.nid = nid;

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
    const userId = req.userId; // Extract user ID from JWT token

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's account deletion request timestamp
    user.accountDeletionRequestedAt = Date.now();
    await user.save();

    // Send a confirmation email for account deletion (you need to implement this)
    await sendAccountDeletionConfirmationEmail(user.email);

    res.status(200).json({ message: "Account deletion request received" });
  } catch (error) {
    console.error("Error in deleting user account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Scheduled function to permanently delete accounts older than 3 days
async function scheduledAccountDeletion() {
  try {
    // Calculate the date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find users with deletion requests older than 3 days
    const usersToDelete = await User.find({
      accountDeletionRequestedAt: { $lt: threeDaysAgo },
      isDeleted: false, // Check if the user account is not already deleted
    });

    // Delete the user accounts
    for (const user of usersToDelete) {
      // You can add additional logic here if needed
      // For example, sending a notification before deletion

      // Mark the user as deleted and save changes
      user.isDeleted = true;
      await user.save();

      // Perform the actual deletion from the database
      await user.remove();
    }
  } catch (error) {
    console.error("Error in scheduled account deletion:", error);
  }
}

// Schedule the account deletion function to run periodically (e.g., daily)
setInterval(scheduledAccountDeletion, 24 * 60 * 60 * 1000); // Run every 24 hours