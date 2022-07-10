const User = require("../models/user");

function auth(username, password) {
  return User.login(username, password);
}

function authorizeToken(token) {
  return User.verifyToken(token);
}

const authService = { auth, authorizeToken };
module.exports = authService;
