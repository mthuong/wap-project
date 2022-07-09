const User = require('../models/user');

const validateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  // console.log(req.headers);
  if (!token) {
    const error = new Error('Invalid token');
    error.statusCode = 401;
    next(error);
  } else {
    const username = User.verifyToken(token);
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