const users = require('../models/users');

const validateToken = (req, res, next) => {
  let token = req.headers['Authorization'];
  if (!token) {
    next(new Error('Invalid token'));
  } else {
    const username = users.verifyToken(username);
    if (username) {
      next(new Error('Invalid token'));
    }
    req.username = username;
    return next();
  }
}

module.exports = validateToken;