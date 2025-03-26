const jwt = require('jsonwebtoken');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'shareplate_secret_key'
    );

    // Get user from the token
    req.db.users.findOne({ _id: decoded.id }, (err, user) => {
      if (err) {
        console.error('DB error in auth middleware:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication error. Please login again.' 
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.userType} is not authorized to access this route` 
      });
    }
    next();
  };
};