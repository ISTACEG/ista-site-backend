const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post.js');
const middlewareRoutine = require('../services/middleware');


router.use(middlewareRoutine); 

router.use((req, res, next) => { 
      if (req.role !== "admin") {
         return res.status(401).json({message: "Unauthorized", authorized: false, notAdmin: true});
      }
      console.log("Admin middleware crossed")   
      next();
});

// all the below routes should only for admins

router.get('/all_pending', async (req, res) => {
    var {head, content} = req.query;
    try {
       var docs = await Post.find({status: "pending"}).exec();
       res.status(200).json({success: true, posts: docs}) 
    } catch(err) {
       console.log("Error at fetching posts : " + err.message);
       res.json({success: false, reason : err.message})
    }
});

router.post('/approve/:post_id', async (req, res) => {
    var post_id = req.params.post_id;
    try {
       var obj = await Post.updateOne({_id : post_id}, {status:"approved"})
       res.status(200).json({success: true});
    } catch (err) {
       console.log("Error in approving post : " + err.message);
       res.json({success: false});
    }
 })

 router.post('/reject/:post_id', async (req, res) => {
    var post_id = req.params.post_id;
    var message = req.query.message;
    try {
       var obj = await Post.updateOne({_id : post_id}, {status:"rejected", rejectionMessage: message})
       res.status(200).json({success: true});
    } catch (err) {
       console.log("Error in approving post : " + err.message);
       res.json({success: false});
    }
 })
 

module.exports = router;