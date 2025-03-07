const express = require("express");
const dotenv = require("dotenv");

// Load environment variables from .env file (if available)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (CORS, JSON parsing)
app.use(express.json());
app.use(require("cors")());

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
