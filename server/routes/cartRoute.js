const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.put('/add', cartController.add);
router.put('/reduce', cartController.reduce);
router.get('/', cartController.get);
router.post('/place-order', cartController.placeOrder);

module.exports = router;