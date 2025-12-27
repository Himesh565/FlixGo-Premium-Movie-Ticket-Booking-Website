const express = require('express');
const {
  getShowsByMovie,
  getShowById,
  getAllShows,
  createShow,
  updateShow,
  deleteShow,
  bookSeats
} = require('../controllers/showController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);

// Protected routes
router.post('/book-seats', auth, bookSeats);

// Admin routes
router.get('/', adminAuth, getAllShows);
router.post('/', adminAuth, createShow);
router.put('/:id', adminAuth, updateShow);
router.delete('/:id', adminAuth, deleteShow);

module.exports = router;
