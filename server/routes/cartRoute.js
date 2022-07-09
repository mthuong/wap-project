const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/product/:productId', cartController.addProduct);
router.put('/', cartController.update);
router.get('/', cartController.get);
router.post('/place-order', cartController.placeOrder);

module.exports = router;