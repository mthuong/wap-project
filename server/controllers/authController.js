const authService = require('../services/auth.service');

exports.login = (req, res, next) => {
  try {
    const { username, password } = req.body;
    const data = authService.auth(username, password);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}