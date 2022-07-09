const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/authentication');

const authRoute = require('./authRoute');
const productRoute = require('./productRoute');
const cartRoute = require('./cartRoute');

router.use('/auth', authRoute);
router.use('/products', validateToken, productRoute);
router.use('/cart', validateToken, cartRoute);

module.exports = router;