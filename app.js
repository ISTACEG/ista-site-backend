const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConnection = require('./config/dbConfig');
const addUser = require('./routes/addUser');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use('/auth', addUser);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});