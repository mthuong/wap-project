const User = require("../models/user");

function auth(username, password) {
  const user = User.login(username, password);

  if (user) {
    return user;
  } else {
    const error = new Error('Invalid username or password!');
    error.statusCode = 222;
    throw error;
  }
}

function authorizeToken(token) {
  return User.verifyToken(token);
}

const authService = { auth, authorizeToken };
module.exports = authService;
