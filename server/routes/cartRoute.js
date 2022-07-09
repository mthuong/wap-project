const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/add', cartController.add);
router.patch('/reduce', cartController.reduce);
router.get('/', cartController.get);

module.exports = router;