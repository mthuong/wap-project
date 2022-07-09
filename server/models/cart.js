const carts = [];

module.exports = class Cart {
  constructor(username) {
    this.username = username;
    this.items = [];
  }

  static getAndAddEmptyCart(username) {
    let cart = carts.find(c => c.username === username);
    if (!cart) {
      cart = new Cart(username);
      carts.push(cart);
    }
    return cart
  }

  canAddItem(item, stock) {
    const i = this.items.find(i => i.id == item.id);
    let quantity = item.quantity;
    if (i) {
      quantity += i.quantity;
    }
    if (quantity > stock) {
      return false;
    }
    return true;
  }

  add(item) {
    let i = this.items.find(i => i.id == item.id);
    if (!i) {
      i = item;
      i.quantity = item.quantity;
      item.total = item.quantity * item.price;
      this.items.push(item);
    } else {
      i.quantity += item.quantity;
      i.total = i.quantity * i.price;
    }
    return i;
  }

  update(item) {
    const i = this.items.find(i => i.id == item.id);
    if (i) {
      i.quantity += item.quantity;
      i.total = i.quantity * i.price;
      if (i.quantity <= 0) {
        const index = this.items.indexOf(i);
        this.items.splice(index, 1);
      }
    }
    return i;
  }

  placeOrder() {
    const index = carts.indexOf(this);
    if (index != -1) {
      return carts.splice(index, 1);
    }
    return {};
  }

  total() {
    return this.items.reduce((total, item) => {
      return total + item.total;
    }, 0);
  }
}