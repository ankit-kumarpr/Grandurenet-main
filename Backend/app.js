const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const connectToDb = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const UserRoutes=require('./routes/UserRoutes');

connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use('/api/user',UserRoutes);

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


module.exports = app;




