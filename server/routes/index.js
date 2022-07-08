const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/authentication');

const authRoute = require('./authRoute');
const productRoute = require('./productRoute');

router.use('/auth', authRoute);
router.use('/products', validateToken, productRoute);

module.exports = router;