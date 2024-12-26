const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    head : { type: String, required: true },
    content: { type:  String, required: true },
    status: { type: String },
    upvote: { type: Array },
    downvote: { type : Array },
    rejectionMessage: { type: String },
    postedBy: {type: String, required : true}
});

const post = mongoose.model('post', postSchema);

module.exports = post;