const cartService = require('../services/cart.service');

exports.addProduct = function (req, res, next) {
  const { productId } = req.params;
  const { username } = req;

  res.json(cartService.add(productId, 1, username));
}

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
  
  // Place order
  res.json(cartService.placeOrder(username));
}