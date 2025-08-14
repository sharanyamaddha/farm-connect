const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Or use process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: '⛔ No token provided or wrong format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ✅ Save decoded info to request
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ message: '⛔ Invalid or expired token' });
  }
};

module.exports = verifyToken;
