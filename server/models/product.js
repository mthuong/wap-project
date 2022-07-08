const configuration = require('../configuration');

const PORT = configuration.PORT;
const HOST = configuration.HOST;
const products = [
  {
    id: '1',
    name: 'Nodejs',
    price: 29.99,
    image: HOST + ":" + PORT + '/public/assets/nodejs.png',
    stock: 20
  },
  {
    id: '2',
    name: 'Reactjs',
    price: 19.99,
    image: HOST + ":" + PORT + '/public/assets/reactjs.png',
    stock: 15
  },
  {
    id: '3',
    name: 'Angular',
    price: 49.99,
    image: HOST + ":" + PORT + '/public/assets/angular.png',
    stock: 15
  },
  {
    id: '4',
    name: 'Javascript',
    price: 59.99,
    image: HOST + ":" + PORT + '/public/assets/javascript.png',
    stock: 15
  }
];

module.exports = class Product {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
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
