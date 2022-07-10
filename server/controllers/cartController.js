const cartService = require('../services/cart.service');

exports.addProduct = function (req, res, next) {
  const { id } = req.body;
  const { username } = req;

  res.json(cartService.add(id, 1, username));
}

exports.update = function(req, res, next) {
  const { productId } = req.params;
  const { quantity } = req.body;
  const { username } = req;

  res.json(cartService.update(productId, quantity, username));
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