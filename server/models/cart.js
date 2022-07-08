const carts = [];

module.exports = class Cart {
  constructor(username) {
    this.username = username;
    this.items = [];
  }

  static getCart(username) {
    return carts.find(c => c.username === username);
  }

  addProduct(product) {
    if (!this.items.find(i => i.id == product.id)) {
      product.quantity = 1;
      this.items.push(product);
    }
  }

  addQuantity(item) {
    const i = this.items.find(i => i.id == item.id);
    if (!i) {
      this.items.push(i);
    } else {
      i.quantity += item.quantity;
    }
  }

  reduceQuantity(item) {
    const i = this.items.find(i => i.id == item.id);
    i.quantity -= item.quantity;
    if (i.quantity <= 0) {
      const index = this.items.indexOf(i);
      this.items.splice(index, 1);
    }
  }
}