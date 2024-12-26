const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // template fields
});

const post = mongoose.model('post', userSchema);

module.exports = post;