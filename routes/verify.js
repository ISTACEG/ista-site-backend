const express = require("express");
const router = express.Router();

const middlewareRoutine = require("../services/middleware");

router.use(middlewareRoutine);

router.post(
  "/",
  async (req, res) => {
    return res.json({ authorized: true, role: res.role, roll: res.roll })
  }
);

module.exports = router;