const Cart = require("../models/cart");
const productService = require("./product.service");

function add(id, quantity, username) {
  const product = productService.getById(id);
  if (!product) {
    throw new Error(`Product id ${id} not found`);
  }

  const cart = Cart.getAndAddEmptyCart(username);
  const { image, stock, ...cartItem } = product;
  cartItem.quantity = quantity;

  if (cart.canAddItem(cartItem, stock)) {
    const result = cart.add(cartItem);
    return result;
  } else {
    throw new Error(`Can not add more items over stock (${stock})`);
  }
}

function reduce(id, quantity, username) {
  const cart = Cart.getAndAddEmptyCart(username);
  const product = productService.getById(id);
  if (!product) {
    throw new Error(`Product id ${id} not found`);
  }

  const { image, stock, ...cartItem } = product;
  cartItem.quantity = quantity;

  const result = cart.reduce(cartItem);

  if (result) {
    return result;
  } else {
    return {
      ...cartItem,
      quantity: 0,
    };
  }
}

function get(username) {
  const cart = Cart.getAndAddEmptyCart(username);
  return cart.items;
}

function placeOrder(username) {
  const cart = Cart.getAndAddEmptyCart(username);

  // Validate can place order
  if (canPlaceOrder(username)) {
    cart.placeOrder();

    cart.items.forEach((prod) => {
      prod.placeOrder();
    });

    return {
      status: 'ok',
      message: 'Order confirmed',
    }
  }

  return {
    status: 'failed',
    message: 'Place order failed',
  }
}

function canPlaceOrder(username) {
  const cart = Cart.getAndAddEmptyCart(username);
  cart.items.forEach((item) => {
    const { id, quantity } = item;
    const canPlaceOrder = productService.canPlaceOrder(id, quantity);
    if (canPlaceOrder == false) {
      return false;
    }
  });

  return true;
}

const cartService = {
  add,
  reduce,
  get,
};

module.exports = cartService;
