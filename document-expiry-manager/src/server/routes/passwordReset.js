const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../../models/User");
const PasswordReset = require("../../models/PasswordReset");
const { sendPasswordResetEmail } = require("../services/emailService");

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token for storage
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to database
    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send email
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({
      message: "Password reset email sent successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify reset token
router.post("/verify-reset-token", async (req, res) => {
  try {
    const { token } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid reset record
    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
      used: false,
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid reset record
    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
      used: false,
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
