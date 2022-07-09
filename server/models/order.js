let orders = [];

module.exports = class Order {
  constructor(items) {
    this.items = items;
  }

  static placeOrder(items) {
    orders.push(new Order(items));
  }
}