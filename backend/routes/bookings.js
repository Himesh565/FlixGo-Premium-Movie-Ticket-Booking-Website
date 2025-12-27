const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updatePaymentStatus,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Protected routes (user)
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/payment', auth, updatePaymentStatus);
router.delete('/:id', auth, cancelBooking);

// Admin routes
router.get('/', adminAuth, getAllBookings);

module.exports = router;
