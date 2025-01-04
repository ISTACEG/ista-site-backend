const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const {
  generateOtp,
  sendOtpMail,
  otpCache,
} = require("../services/mailService");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const cheerio = require("cheerio");

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
      const student_email = `${roll.trim()}@student.annauniv.edu`;
      const user = await User.findOne({ roll });
      const year = parseInt(roll.substring(0, 4)) + 4;

      console.log(roll);

      if (user && user.verified && user.password) {
        const resp = {
          student_email: user.student_mail,
          verified: user.verified,
          message: "User already exists and verified",
        };
        return res.status(200).json(resp);
      } else {
        if (!user) {
          console.log(roll, student_email, year);
          const newUser = new User({ roll, student_mail: student_email, year });
          await newUser.save();
        }
        const otp = generateOtp(roll);

        try {
          await sendOtpMail(student_email, otp);
          const resp = {
            student_email,
            message: "OTP generated and sent to email",
          };
          return res.status(200).json(resp);
        } catch (error) {
          return res
            .status(500)
            .json({ message: "Error sending email", error });
        }
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.post(
  "/verifyOtp",
  body("roll").notEmpty().withMessage("Roll number is required"),
  body("otp").notEmpty().withMessage("OTP is required"),
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
        const user = await User.findOneAndUpdate({ roll }, { verified: true });
        otpCache.del(roll);
        return res.status(200).json({ message: "OTP verified", user });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.post(
  "/addDetails",
  [
    body("roll").notEmpty().withMessage("Roll number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("personal_mail")
      .optional()
      .isEmail()
      .withMessage("Invalid email address"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roll, personal_mail, password } = req.body;
      const user = await User.findOne({ roll });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.verified) {
        return res.status(403).json({ message: "User not verified" });
      }

      if (personal_mail) {
        user.personal_mail = personal_mail;
        await user.save();
      }
      if (!user.password) {
        user.password = await bcrypt.hash(password, 10);
      } else {
        return res
          .status(400)
          .json({
            message:
              "User already exists, If you want to change use the forgot password route",
          });
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Details added successfully", success: true });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

module.exports = router;
