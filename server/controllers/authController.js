const User = require('../models/users');

exports.login = (req, res, next) => {
  try {
    const { username, password } = req.body;
    const data = User.login(username, password);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}