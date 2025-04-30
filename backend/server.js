require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const app = express();
const connectDB = require("../backend/config/db");
const session = require('express-session');
const passport = require('passport');
const { errorHandler } = require("./middleware/errorMiddleware");
const sellerRoutes = require("./routes/seller");
const buyerRoutes = require("./routes/buyer");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const alertRoutes = require("./routes/alertRoutes");
const contactRoutes = require("./routes/contactRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const bidRoutes = require("./routes/bid");
const mongoose = require('mongoose');
const configureSocket = require('./config/socket');
const conversationRoutes = require("./routes/conversationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());

// Allow both frontend ports
const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:5173'], // Add your frontend URL
  credentials: true,  // Allows cookies & authentication headers
};

app.use(cors(corsOptions));
app.use(cookieParser());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP server
const server = require('http').createServer(app);

// Configure Socket.IO
const io = configureSocket(server);

// Make io accessible to routes
app.set('io', io);

// Error handling middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
