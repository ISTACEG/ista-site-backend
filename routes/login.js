const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.post(
  "/userLogin",
  [
    body("roll").notEmpty().withMessage("Roll number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roll, password } = req.body;

    try {
      const user = await User.findOne({ roll });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (!user.verified) {
        return res
          .status(403)
          .json({ success: false, message: "User not verified" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Login successful" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
);

module.exports = router;
