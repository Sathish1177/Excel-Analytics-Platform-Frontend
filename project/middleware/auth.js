import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'your-jwt-secret-key'); // Replace with actual secret key or import from config
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;