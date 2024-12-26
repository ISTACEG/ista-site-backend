const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: false },
    password: { type: String, required: true, unique: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;