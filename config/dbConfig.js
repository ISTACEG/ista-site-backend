const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URL defined inside .env file. 
const dbURL = process.env.MONGODB_URL;

// MongoDB options
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(dbURL, dbOptions)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error: ', error);
    });

module.exports = mongoose.connection;
