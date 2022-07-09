const cartService = require('../services/cart.service');

exports.add = function(req, res, next) {
  const { id, quantity } = req.body;
  const { username } = req;

  res.json(cartService.add(id, quantity, username));
}

exports.reduce = function(req, res, next) {
  const { id, quantity } = req.body;
  const { username } = req;

  res.json(cartService.reduce(id, quantity, username));
}

exports.get = function(req, res, next) {
  const { username } = req;
  res.json(cartService.get(username));
}

exports.placeOrder = function(req, res, next) {
  const { username } = req;
  
  // TODO: Place order
}