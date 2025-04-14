// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   // First check Authorization header, then cookies
//   const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  
//   if (!token) {
//     console.warn('[Auth Middleware] No token found');
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('[Auth Middleware] Valid token for:', decoded.email);
    
//     // Check token expiration
//     const now = Math.floor(Date.now() / 1000);
//     if (decoded.exp && decoded.exp < now) {
//       console.warn(`[Auth Middleware] Expired token (exp: ${decoded.exp}, now: ${now})`);
//       return res.status(401).json({ message: "Token expired" });
//     }

//     req.user = decoded;
//     console.log('[Auth Middleware] Decoded token payload:', decoded);
//     next();
//   } catch (error) {
//     console.error('[Auth Middleware] Token verification failed:', error.message);
//     res.status(401).json({ message: "Invalid Token" });
//   }
// };
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   // First check Authorization header, then cookies
//   const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  
//   if (!token) {
//     console.warn('[Auth Middleware] No token found');
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('[Auth Middleware] Valid token for:', decoded.email);
    
//     // Check token expiration
//     const now = Math.floor(Date.now() / 1000);
//     if (decoded.exp && decoded.exp < now) {
//       console.warn(`[Auth Middleware] Expired token (exp: ${decoded.exp}, now: ${now})`);
//       return res.status(401).json({ message: "Token expired" });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('[Auth Middleware] Token verification failed:', error.message);
//     res.status(401).json({ message: "Invalid Token" });
//   }
// };
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Enhanced protect middleware with cookie support
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

// Optional: Token refresh middleware
const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      console.warn('[Auth Middleware] Invalid refresh token');
      return next();
    }

    // Generate new access token
    const newToken = generateToken(user._id);
    res.setHeader('Authorization', `Bearer ${newToken}`);
    console.log('[Auth Middleware] Token refreshed successfully');
    next();
  } catch (error) {
    console.error('[Auth Middleware] Refresh token failed:', error.message);
    next();
  }
});

// Helper function to generate tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = { 
  protect, 
  admin, 
  refreshToken,
  generateToken
};