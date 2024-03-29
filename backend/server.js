const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");

require("dotenv").config();
require("./db/conn");

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// routes
app.use(authRoutes);
app.use(employeeRoutes);

app.listen(PORT, () => console.log("Server running on port " + PORT));
