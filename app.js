const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnection = require('./config/dbConfig');
const addUser = require('./routes/addUser');
const posts = require('./routes/post');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/auth', addUser);
app.use('/post', addUser);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});