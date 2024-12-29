const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnection = require("./config/dbConfig");
const cors = require("cors");
const addUser = require("./routes/addUser");
const posts = require("./routes/post");
const admin = require("./routes/admin");
const login = require("./routes/login");
const profile = require("./routes/profile");
const verify = require("./routes/verify");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4000;

//logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(cors());

app.use("/auth/register", addUser);
app.use("/auth/login", login);
app.use("/auth/check",verify);
app.use("/post", posts);
app.use("/admin", admin);
app.use("/profile", profile);

app.use("/*", (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
