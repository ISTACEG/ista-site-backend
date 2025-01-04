const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');

const middlewareRoutine  = require('../services/middleware.js');

router.use(middlewareRoutine)

router.post('/new', async (req, res) => {
   console.log("received")
   var roll = req.roll;
   var {head, content, idRevealPreferance} = req.body;
   console.log(roll, head, content, idRevealPreferance);
   try {
      var grievance = new Post({
       head, content, postedBy: roll, status:"pending", hideIdentity: idRevealPreferance === "hide"
      })
      await grievance.save();
      console.log(head, content);
      res.status(200).json({success: true}); 
   } catch(err) {
      console.log("Error at adding post : " + err.message);
      res.json({success: false})
   }
});

router.get('/all_approved', async (req, res) => {
   var {head, content} = req.query;
   try {
      var docs = await Post.find({status: "approved"}).exec();
      const formattedDocs = docs.map(post => ({
         _id: post._id,
         head: post.head,
         content: post.content,
         upvoteCount: post.upvote.length,
         downvoteCount: post.downvote.length,
         upvoted: post.upvote.includes(req.roll),
         downvoted: post.downvote.includes(req.roll),
         ...(post.hideIdentity === false && { postedBy: post.postedBy }),
       }));
      res.status(200).json({success: true, posts: formattedDocs}) 
   } catch(err) {
      console.log("Error at fetching posts : " + err.message);
      res.json({success: false, reason : err.message})
   }
});


router.post("/toggle_upvote/:post_id", async (req, res) => {
   var roll = req.roll;
   var post_id = req.params.post_id;
   console.log(roll, post_id);
   try {
      var thatPost = await Post.findById(post_id).exec();
      console.log(thatPost);

      if (thatPost.upvote.includes(roll)) {
         await Post.updateOne({_id: post_id}, {$pull: { upvote: roll}})
      } else {
         await Post.updateOne({_id: post_id}, {$addToSet: { upvote: roll}})
         await Post.updateOne({_id: post_id}, {$pull: { downvote: roll}})
      }

      thatPost = await Post.findById(post_id).exec();

      res.status(200).json({
         success: true, 
         upvoted: thatPost.upvote.includes(roll), 
         downvoted: thatPost.downvote.includes(roll),
         upvoteCount: thatPost.upvote.length,
         downvoteCount: thatPost.downvote.length
      }) 

   } catch(err) {
      console.log("Error at up voting post : " + err.message);
      res.json({success: false})
   }
})

router.post("/toggle_downvote/:post_id", async (req, res) => {
   var roll = req.roll || "2021115125";
   var post_id = req.params.post_id;

   try {
      var thatPost = await Post.findById(post_id).exec();
      console.log(thatPost);

      if (thatPost.downvote.includes(roll)) {
         await Post.updateOne({_id: post_id}, {$pull: { downvote: roll}})
      } else {
         await Post.updateOne({_id: post_id}, {$addToSet: { downvote: roll}})
         await Post.updateOne({_id: post_id}, {$pull: { upvote: roll}})
      }

      thatPost = await Post.findById(post_id).exec();

      res.status(200).json({
         success: true, 
         upvoted: thatPost.upvote.includes(roll), 
         downvoted: thatPost.downvote.includes(roll),
         upvoteCount: thatPost.upvote.length,
         downvoteCount: thatPost.downvote.length
      }) 
      
   } catch(err) {
      console.log("Error at downvoting post : " + err.message);
      res.json({success: false})
   }
})


module.exports = router;