const Product = require('../models/product');

function getAll() {
  return Product.getAll();
}

function getById(id) {
  return Product.getProductById(id);
}

function canPlaceOrder(id, quantity) {
  const prod = Product.getById(id);
  return prod.canPlaceOrder(quantity);
}

const productService = {
  getAll,
  placeOrder,
  getById,
  canPlaceOrder,
};

module.exports = productService;