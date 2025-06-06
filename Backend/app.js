// const dotenv = require("dotenv");
// dotenv.config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const bodyParser = require('body-parser');
// const connectToDb = require("./db/db");
// const authRoutes = require("./routes/authRoutes");
// const UserRoutes=require('./routes/UserRoutes');

// connectToDb();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);
// app.use('/api/user',UserRoutes);

// module.exports = app;




const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectToDb = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", UserRoutes);

// ✅ Serve React frontend
const __dirname = path.resolve(); // important in ES modules
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = app;
