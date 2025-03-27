const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // First check Authorization header, then cookies
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  
  if (!token) {
    console.warn('[Auth Middleware] No token found');
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Middleware] Valid token for:', decoded.email);
    
    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.warn(`[Auth Middleware] Expired token (exp: ${decoded.exp}, now: ${now})`);
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification failed:', error.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};
