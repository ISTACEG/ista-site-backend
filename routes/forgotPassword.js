const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const {
  generateOtp,
  sendForgotOtpMail,
  otpCache,
} = require("../services/mailService");
const bcrypt = require("bcryptjs");


router.post(
  "/generateOtp",
  body("roll").notEmpty().withMessage("Roll number is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roll } = req.body;
      const user = await User.findOne({ roll });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = generateOtp(roll);
      const student_email = user.student_mail;

      try {
        await sendForgotOtpMail(student_email, otp);
        return res.status(200).json({ message: "OTP generated and sent to email" });
      } catch (error) {
        return res.status(500).json({ message: "Error sending email", error });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);


router.post(
  "/verifyOtp",
  [
    body("roll").notEmpty().withMessage("Roll number is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roll, otp } = req.body;
      const cachedOtp = otpCache.get(roll);

      if (!cachedOtp) {
        return res.status(400).json({ message: "OTP expired or not found" });
      }

      if (parseInt(otp) === cachedOtp) {
        otpCache.set(`${roll}_verified`, true, 600); // verified flag ttl value
        otpCache.del(roll);
        return res.status(200).json({ message: "OTP verified" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Change Password
router.post(
  "/changePassword",
  [
    body("roll").notEmpty().withMessage("Roll number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roll, password } = req.body;
      const isVerified = otpCache.get(`${roll}_verified`);

      if (!isVerified) {
        return res.status(403).json({ message: "OTP verification required or expired" });
      }

      const user = await User.findOne({ roll });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.password = await bcrypt.hash(password, 10);
      await user.save();
      otpCache.del(`${roll}_verified`);

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

module.exports = router;