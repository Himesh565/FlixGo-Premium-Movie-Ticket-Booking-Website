const express = require('express');
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/orders', auth, createOrder);
router.post('/verify', auth, verifyPayment);
router.get('/key', auth, getRazorpayKey);

module.exports = router;
