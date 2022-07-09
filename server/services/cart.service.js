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
    const total = cart.total();
    return {
      total,
      item: result,
    };
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
  const total = cart.total();

  if (result) {
    return {
      total,
      item: result,
    };
  } else {
    return {
      item: { ...cartItem, quantity: 0 },
      total,
    };
  }
}

function get(username) {
  const cart = Cart.getAndAddEmptyCart(username);
  const total = cart.total();

  return {
    total,
    items: cart.items
  };
}

function placeOrder(username) {
  const cart = Cart.getAndAddEmptyCart(username);

  // Validate if can place order
  if (canPlaceOrder(username)) {
    cart.placeOrder();

    if (!cart.items || cart.items.length == 0) {
      return {
        status: "failed",
        message: "Your cart is empty",
      };
    }

    cart.items.forEach((prod) => {
      productService.placeOrder(prod);
    });

    return {
      status: "ok",
      message: "Order confirmed",
    };
  }

  return {
    status: "failed",
    message: "Place order failed",
  };
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
  placeOrder,
};

module.exports = cartService;
