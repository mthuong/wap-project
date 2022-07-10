const User = require('../models/user');
const authService = require('../services/auth.service');

const validateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    const error = new Error('Invalid token');
    error.statusCode = 401;
    next(error);
  } else {
    const username = authService.authorizeToken(token);
    if (!username) {
      const error = new Error('Un-Authorization');
      error.statusCode = 401;
      next(error);
    }
    req.username = username;
    return next();
  }
}

module.exports = validateToken;