const products = [
  {
    id: '1',
    title: 'Nodejs',
    price: 29.99,
    image: process.env.HOST + ":" + process.env.PORT + '/public/assets/nodejs.png',
    stock: 20
  },
  {
    id: '2',
    title: 'Reactjs',
    price: 19.99,
    image: process.env.HOST + ":" + process.env.PORT + '/public/assets/reactjs.png',
    stock: 15
  },
  {
    id: '3',
    title: 'Angular',
    price: 49.99,
    image: process.env.HOST + ":" + process.env.PORT + '/public/assets/angular.png',
    stock: 15
  },
  {
    id: '4',
    title: 'Javascript',
    price: 59.99,
    image: process.env.HOST + ":" + process.env.PORT + '/public/assets/angular.png',
    stock: 15
  }
];

module.exports = class Product {
  constructor(id, title, price, image) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
  }

  save() {
    let uuid = crypto.randomUUID();
    this.id = uuid;
    products.push(this);
    return this;
  }

  edit() {
    const index = products.findIndex((p) => p.id == this.id);
    products.splice(index, 1, this);
    return this;
  }

  static getAll() {
    return products;
  }

  static deleteById(prodId) {
    const index = products.findIndex((p) => p.id == prodId); // Because prodId can be string or number
    const deleteProd = products[index];
    products.splice(index, 1);
    return deleteProd;
  }
};
