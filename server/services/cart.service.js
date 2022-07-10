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
    const error = new Error(`Can not add more items over stock (${stock})`);
    error.statusCode = 212;
    throw error;
  }
}

function update(id, quantity, username) {
  const cart = Cart.getAndAddEmptyCart(username);
  const product = productService.getById(id);
  if (!product) {
    throw new Error(`Product id ${id} not found`);
  }

  const { image, stock, ...cartItem } = product;
  cartItem.quantity = quantity;

  if (quantity > 0 && !cart.canAddItem(cartItem, stock)) {
    const error = new Error(`Can not add more items over stock (${stock})`);
    error.statusCode = 213;
    throw error;
  }

  const result = cart.update(cartItem);
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
    items: cart.items,
  };
}

function placeOrder(username) {
  const cart = Cart.getAndAddEmptyCart(username);

  // Validate if can place order
  if (canPlaceOrder(username)) {
    cart.placeOrder();

    if (!cart.items || cart.items.length == 0) {
      const error = new Error("Your cart is empty");
      error.statusCode = 210;
      throw error;
    }

    cart.items.forEach((prod) => {
      productService.placeOrder(prod);
    });

    return {
      status: "ok",
      message: "Order confirmed",
    };
  }

  const error = new Error("Place order failed");
  cart.items.forEach(item => {
    const { id, quantity, name } = item;
    const canPlaceOrder = productService.canPlaceOrder(id, quantity);
    const product = productService.getById(id);
    if (canPlaceOrder == false) {
      error.message += `\nItem ${name} is over-ordered in stock (${product.stock})`;
    }
  })
  error.statusCode = 211;
  throw error;
}

function canPlaceOrder(username) {
  const cart = Cart.getAndAddEmptyCart(username);
  const canPlaceOrder = cart.items.filter((item) => {
    const { id, quantity } = item;
    const canPlaceOrder = productService.canPlaceOrder(id, quantity);
    return !canPlaceOrder;
  });

  return canPlaceOrder.length == 0;
}

const cartService = {
  add,
  update,
  get,
  placeOrder,
};

module.exports = cartService;
