const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/ConnectToMongoDb');
const authRoutes = require("./src/routes/authRoutes");
const hospitalRoutes = require( "./src/routes/hospitalRoutes");
const bedRoutes = require("./src/routes/bedRoutes");
const bedAssignmentRoutes = require("./src/routes/bedAssignmentRoutes");
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/hospitals", hospitalRoutes);
app.use("/beds", bedRoutes);
app.use("/bedassignments", bedAssignmentRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital Management System API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
