const productService = require('../services/product.service');

exports.getAll = (req, res, next) => {
  res.status(200).json(productService.getAll());
}