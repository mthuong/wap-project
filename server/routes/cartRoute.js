const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/', cartController.addProduct);
router.put('/:productId', cartController.update);
router.get('/', cartController.get);
router.post('/place-order', cartController.placeOrder);

module.exports = router;