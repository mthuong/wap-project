const User = require('../models/user');

function auth(username, password) {
  return User.login(username, password);
}

const authService = { auth };
module.exports = authService;