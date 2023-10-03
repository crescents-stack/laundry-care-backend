const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin/admins.model");
const { secretKey } = require("../../config/config");
const { sendEmail } = require("../../utils/nodemailer.setup");
const config = require("../../config/config");

// Register a new admin with email verification
exports.register = async (req, res) => {
  try {
    const { name, email, phone, nid, password, clientUrl } = req.body;

    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists." });
    }

    const existingAdminByPhone = await Admin.findOne({ phone });
    if (existingAdminByPhone) {
      return res
        .status(400)
        .json({ message: "Admin with this phone already exists." });
    }

    const existingAdminByNID = await Admin.findOne({ nid });
    if (existingAdminByNID) {
      return res
        .status(400)
        .json({ message: "Admin with this NID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      phone,
      nid,
      password: hashedPassword,
      role: "admin",
      emailVerification: false,
    });

    await newAdmin.save();

    const emailVerificationToken = generateEmailVerificationToken(newAdmin);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in admin registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login an admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.emailVerification) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    const token = jwt.sign({ adminId: admin._id, role: admin.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, admin });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password: Send a password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const passwordResetToken = generatePasswordResetToken(admin);
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

    const decoded = jwt.verify(token, secretKey);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;

    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verification = async (req, res) => {
  const token = req.header("Authorization").slice(7);

  try {
    const decoded = jwt.verify(token, config.secretKey);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.emailVerification = true;

    await admin.save();

    res.status(200).send({ message: "Email verification successful" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

exports.verificationLatter = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    const admin = await Admin.find({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const emailVerificationToken = generateEmailVerificationToken(admin[0]);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

// Get admin data by ID (protected route)
exports.getAdminData = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error in getting admin data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update admin data (protected route)
exports.updateAdminData = async (req, res) => {
  try {
    const { name, address } = req.body;

    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = name;
    admin.address = address;

    await admin.save();

    res.status(200).json({ message: "Admin data updated successfully" });
  } catch (error) {
    console.error("Error in updating admin data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete admin account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const deletedAdmin = await Admin.findByIdAndRemove(admin._id);

    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (error) {
    console.error("Error in deleting admin account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Password reset token generation (you need to implement this)
function generatePasswordResetToken(admin) {
  return jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: "1h" });
}

// Email verification token generation (you need to implement this)
function generateEmailVerificationToken(admin) {
  return jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: "1h" });
}
