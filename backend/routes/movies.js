const express = require('express');
const { 
  getAllMovies, 
  getMovieById, 
  createMovie, 
  updateMovie, 
  deleteMovie,
  getDashboardStats 
} = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Admin routes (must come before dynamic routes)
router.get('/admin/dashboard-stats', adminAuth, getDashboardStats);
router.post('/', adminAuth, upload.single('poster'), createMovie);
router.put('/:id', adminAuth, upload.single('poster'), updateMovie);
router.delete('/:id', adminAuth, deleteMovie);

// Public routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

module.exports = router;
