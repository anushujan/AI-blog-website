const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Attach user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;