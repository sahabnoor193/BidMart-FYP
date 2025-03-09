
// // Load environment variables from .env file (if available)
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware (CORS, JSON parsing)
// app.use(express.json());
// app.use(require("cors")());

// // Simple test route
// app.get("/", (req, res) => {
//   res.send("Backend is running successfully!");
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const authRoutes = require("./routes/authRoutes");
// const connectDB = require("../backend/config/db");
// const session = require('express-session');
// const passport = require('passport');
// const errorHandler = require("./middleware/errorMiddleware");
// const sellerRoutes = require("./routes/seller");
// const userRoutes = require("./routes/user");

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// // app.use(errorHandler);

// // Middleware
// app.use(express.json());

// // Allow both frontend ports
// const corsOptions = {
//   origin: ['http://localhost:5000', 'http://localhost:5173'], // Add your frontend URL
//   credentials: true,  // Allows cookies & authentication headers
// };

// // app.use(cors());
// app.use(cors(corsOptions));
// app.use(cookieParser());

// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/seller", sellerRoutes);
// app.use("/api/user", userRoutes);

// app._router.stack.forEach((r) => {
//   if (r.route && r.route.path) {
//       console.log(r.route.path);
//   }
// });


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Error handling middleware (add at end of server.js)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
//   });


// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const passport = require("passport");

// // Import routes and database connection
// const authRoutes = require("./routes/authRoutes");
// const sellerRoutes = require("./routes/seller");
// const userRoutes = require("./routes/user");
// const connectDB = require("./config/db"); 
// const errorHandler = require("./middleware/errorMiddleware");

// // Load environment variables from .env file
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to database
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // CORS Configuration
// const corsOptions = {
//   origin: ['http://localhost:5000', 'http://localhost:5173'], // Frontend URLs
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/seller", sellerRoutes);
// app.use("/api/user", userRoutes);

// // Test route
// app.get("/", (req, res) => {
//   res.send("Backend is running successfully!");
// });

// // Error handling middleware (should be at the end)
// app.use(errorHandler);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


//Server.js copied raw code from Github
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
//const buyerRoutes = require("./routes/buyer");
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
//app.use("/api/buyer", buyerRoutes);


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