const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middlewareRoutine = require("../services/middleware");


router.use(middlewareRoutine);
router.get("/", async (req, res) => {    
    var roll = req.roll;
    try {
        var user = await User.findOne({ roll }).exec();
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.log("Error at getting user : " + err.message);
        res.json({ success: false });
    }
})

module.exports = router;