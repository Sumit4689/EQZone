const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token;
  let isAuthenticated = false;

  // Check if token is in the Authorization header or cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is provided, continue but mark as not authenticated
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, 
      email: decoded.email, 
      name: decoded.name, 
      username: decoded.username 
    }; // Attach user info to the request object
    req.isAuthenticated = true;
    next(); // Allow request to continue to the next handler
  } catch (error) {
    // If token is invalid, continue but mark as not authenticated
    req.isAuthenticated = false;
    next();
  }
};

module.exports = verifyToken;
