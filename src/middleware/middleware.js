const { verify } = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.split("Bearer ")[1];

    if (!token) {
      return res.sendStatus(401); // Unauthorized if no token is provided
    }

    try {
      const decoded = verify(token, 'your-secret-key');
      const user = await User.getUserById(decoded.id);

      if (!user || user.token !== token) {
        // Clear user's token in the database to force re-login
        await User.updateUserToken(decoded.id, null); // Set token to null or remove token field based on your setup

        return res.status(403).json({ error: 'Token mismatch or user not found. Please log in again.' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.sendStatus(401); // Unauthorized if token is invalid
      }
      console.error(error);
      return res.sendStatus(500); // Server error for other errors
    }
  } else {
    return res.sendStatus(401); // Unauthorized if no or invalid authorization header
  }
};

module.exports = { authenticateToken };
