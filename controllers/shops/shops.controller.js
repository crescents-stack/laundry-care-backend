const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Shop = require("../../models/shop/shop.model");
const { secretKey } = require("../../config/config");
const { sendEmail } = require("../../utils/nodemailer.setup");
const config = require("../../config/config");

// Register a new shop with email verification
exports.register = async (req, res) => {
  try {
    const { name, email, phone, nid, password, clientUrl } = req.body;

    const existingShopByEmail = await Shop.findOne({ email });
    if (existingShopByEmail) {
      return res
        .status(400)
        .json({ message: "Shop with this email already exists." });
    }

    const existingShopByPhone = await Shop.findOne({ phone });
    if (existingShopByPhone) {
      return res
        .status(400)
        .json({ message: "Shop with this phone already exists." });
    }

    const existingShopByNID = await Shop.findOne({ nid });
    if (existingShopByNID) {
      return res
        .status(400)
        .json({ message: "Shop with this NID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = new Shop({
      name,
      email,
      phone,
      nid,
      password: hashedPassword,
      role: "shop",
      emailVerification: false,
    });

    await newShop.save();

    const emailVerificationToken = generateEmailVerificationToken(newShop);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Shop registered successfully" });
  } catch (error) {
    console.error("Error in shop registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login a shop
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const shop = await Shop.findOne({ email });

    if (!shop || !(await bcrypt.compare(password, shop.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!shop.emailVerification) {
      return res.status(401).json({ message: "Email is not verified" });
    }

    const token = jwt.sign({ userId: shop._id, role: shop.role }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, shop });
  } catch (error) {
    console.error("Error in shop login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password: Send a password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const passwordResetToken = generatePasswordResetToken(shop);
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

    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    shop.password = hashedPassword;

    await shop.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification
exports.verification = async (req, res) => {
  const token = req.header("Authorization").slice(7);

  try {
    const decoded = jwt.verify(token, config.secretKey);

    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    shop.emailVerification = true;

    await shop.save();

    res.status(200).send({ message: "Email verification successful" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification failed" });
  }
};

// Send email verification link again
exports.verificationLatter = async (req, res) => {
  try {
    const { email, clientUrl } = req.body;

    const shop = await Shop.find({ email });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const emailVerificationToken = generateEmailVerificationToken(shop[0]);
    const emailVerificationLink = `${clientUrl}?token=${emailVerificationToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${emailVerificationLink}`
    );

    res.status(201).json({ message: "Email verification link sent successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(401).send({ error: "Email verification link sending failed" });
  }
};

// Get shop data by ID (protected route)
exports.getShopData = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ shop });
  } catch (error) {
    console.error("Error in getting shop data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update shop data (protected route)
exports.updateShopData = async (req, res) => {
  try {
    const { name, address } = req.body;

    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.name = name;
    shop.address = address;

    await shop.save();

    res.status(200).json({ message: "Shop data updated successfully" });
  } catch (error) {
    console.error("Error in updating shop data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete shop account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const token = req.header("Authorization").slice(7);

    const decoded = jwt.verify(token, secretKey);

    const shop = await Shop.findById(decoded.userId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const deletedShop = await Shop.findByIdAndRemove(shop._id);

    if (!deletedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json({ message: "Shop account deleted successfully" });
  } catch (error) {
    console.error("Error in deleting shop account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Password reset token generation (you need to implement this)
function generatePasswordResetToken(shop) {
  return jwt.sign({ userId: shop._id }, secretKey, { expiresIn: "1h" });
}
