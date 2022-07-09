const Product = require('../models/product');

function getAll() {
  return Product.getAll();
}

function getById(id) {
  return Product.getProductById(id);
}

function canPlaceOrder(id, quantity) {
  const prod = Product.getProductById(id);
  return prod.canPlaceOrder(quantity);
}

function placeOrder(prod) {
  const p = Product.getProductById(prod.id);
  if (p) {
    p.stock -= prod.quantity;
  }
  return p;
}

const productService = {
  getAll,
  getById,
  canPlaceOrder,
  placeOrder,
};

module.exports = productService;