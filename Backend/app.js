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


const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", UserRoutes);

// ========= VITE frontend serving =========
const __dirnamePath = path.resolve(); // __dirname workaround for ES modules
app.use(express.static(path.join(__dirnamePath, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "dist", "index.html"));
});
// =========================================

module.exports = app;

