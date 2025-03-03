require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const app = express();
const connectDB = require("../backend/config/db");
const session = require('express-session');
const passport = require('passport');
const errorHandler = require("./middleware/errorMiddleware");
const sellerRoutes = require("./routes/seller");
const userRoutes = require("./routes/user");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(errorHandler);

// Middleware
app.use(express.json());

// Allow both frontend ports
const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:5173'], // Add your frontend URL
  credentials: true,  // Allows cookies & authentication headers
};

// app.use(cors());
app.use(cors(corsOptions));
app.use(cookieParser());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/user", userRoutes);

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
      console.log(r.route.path);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling middleware (add at end of server.js)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
