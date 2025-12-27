const express = require('express');
const {
  getAllTheaters,
  getAllTheatersAdmin,
  getTheaterById,
  getTheatersByCity,
  createTheater,
  updateTheater,
  deleteTheater,
  getCities,
  getTheaterStats
} = require('../controllers/theaterController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Admin routes (must come first)
router.get('/admin/stats', adminAuth, getTheaterStats);
router.get('/admin/all', adminAuth, getAllTheatersAdmin);
router.post('/', adminAuth, upload.single('image'), createTheater);
router.put('/:id', adminAuth, upload.single('image'), updateTheater);
router.delete('/:id', adminAuth, deleteTheater);

// Public routes
router.get('/cities', getCities);
router.get('/city/:city', getTheatersByCity);
router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);

module.exports = router;
