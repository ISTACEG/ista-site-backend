const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post.js");
const middlewareRoutine = require("../services/middleware");

router.use(middlewareRoutine);

// all the below routes should only for admins

router.get("/all_pending", async (req, res) => {
  console.log(req.role);
  if (req.role !== "admin") {
    console.log("Not a Admin");
    return res
      .status(401)
      .json({ message: "Unauthorized", authorized: false, notAdmin: true });
  }

  var { head, content } = req.query;
  try {
    var docs = await Post.find({ status: "pending" }).exec();
    res.status(200).json({ success: true, posts: docs });
  } catch (err) {
    console.log("Error at fetching posts : " + err.message);
    res.json({ success: false, reason: err.message });
  }
});

router.post("/approve/:post_id", async (req, res) => {
  if (req.role !== "admin") {
    console.log("Not a Admin");
    return res
      .status(401)
      .json({ message: "Unauthorized", authorized: false, notAdmin: true });
  }
  var post_id = req.params.post_id;
  try {
    var obj = await Post.updateOne({ _id: post_id }, { status: "approved", takenAt: new Date() });
    res.status(200).json({ success: true, message: "Approved" });
  } catch (err) {
    console.log("Error in approving post : " + err.message);
    res.json({ success: false, message: err.message });
  }
});

router.post("/reject/:post_id", async (req, res) => {
  if (req.role !== "admin") {
    console.log("Not a Admin");
    return res
      .status(401)
      .json({ message: "Unauthorized", authorized: false, notAdmin: true });
  }
  var post_id = req.params.post_id;
  var message = req.body.message;
  try {
    var obj = await Post.updateOne(
      { _id: post_id },
      { status: "rejected", rejectionMessage: message, takenAt: new Date() }
    );
    res.status(200).json({ success: true, message: "Rejected" });
  } catch (err) {
    console.log("Error in approving post : " + err.message);
    res.json({ success: false, message: err.message });
  }
});

router.post("/mark_as_resolved/:post_id", async (req, res) => {
  if (req.role !== "admin") {
    console.log("Not a Admin");
    return res
      .status(401)
      .json({ message: "Unauthorized", authorized: false, notAdmin: true });
  }
  var post_id = req.params.post_id;
  try {
    var obj = await Post.updateOne({ _id: post_id }, { status: "resolved", resolvedAt: new Date() });
    res.status(200).json({ success: true, message: "Marked as Resolved" });
  } catch (err) {
    console.log("Error in resolving post : " + err.message);
    res.json({ success: false, message: err.message });
  }
});

router.post("/remove/:post_id", async (req, res) => {
  if (req.role !== "admin") {
    console.log("Not a Admin");
    return res
      .status(401)
      .json({ message: "Unauthorized", authorized: false, notAdmin: true });
  }
  var post_id = req.params.post_id;
  try {
    var obj = await Post.updateOne({ _id: post_id }, { status: "removed" });
    res.status(200).json({ success: true, message: "Remove from feed" });
  } catch (err) {
    console.log("Error in resolving post : " + err.message);
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
