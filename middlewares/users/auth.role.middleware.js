// roleMiddleware.js

const checkRole = (role) => {
    return (req, res, next) => {
      // Check if the user has the required role
      if (req.baseUrl.includes(role)) {
        next(); // User has the required role, move on to the next middleware or route handler
      } else {
        res.status(403).json({ error: 'Permission denied' });
      }
    };
  }
  
  module.exports = { checkRole };
  