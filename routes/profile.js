const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middlewareRoutine = require("../services/middleware");
const Post = require("../models/post");


router.use(middlewareRoutine);
router.get("/", async (req, res) => {    
    var roll = req.roll;
    try {
        var user = await User.findOne({ roll }).exec();
        var grievances = await Post.find({ postedBy: roll }).exec();    
        res.status(200).json({ success: true, user, grievances });
    } catch (err) {
        console.log("Error at getting user : " + err.message);
        res.json({ success: false, message: err.message });
    }
})

module.exports = router;