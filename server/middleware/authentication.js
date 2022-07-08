const User = require('../models/user');

const validateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  console.log(req.headers);
  if (!token) {
    next(new Error('Invalid token'));
  } else {
    const username = User.verifyToken(token);
    if (!username) {
      next(new Error('Un-Authorization'));
    }
    req.username = username;
    return next();
  }
}

module.exports = validateToken;