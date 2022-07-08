const Product = require('../models/product');

exports.getAll = (req, res, next) => {
  res.status(200).json(Product.getAll());
}