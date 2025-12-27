const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }

    const movies = await Movie.find(query);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create movie (Admin only)
const createMovie = async (req, res) => {
  try {
    const movieData = { ...req.body };

    // Handle cast array from FormData
    if (movieData.cast && typeof movieData.cast === 'object' && !Array.isArray(movieData.cast)) {
      // Convert cast object to array
      movieData.cast = Object.values(movieData.cast);
    } else if (typeof movieData.cast === 'string') {
      // Handle comma-separated string
      movieData.cast = movieData.cast.split(',').map(c => c.trim()).filter(c => c);
    }

    // If a file was uploaded, use the file path instead of URL
    if (req.file) {
      movieData.poster = `/uploads/${req.file.filename}`;
    }

    const movie = new Movie(movieData);
    await movie.save();

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update movie (Admin only)
const updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle cast array from FormData
    if (updateData.cast && typeof updateData.cast === 'object' && !Array.isArray(updateData.cast)) {
      // Convert cast object to array
      updateData.cast = Object.values(updateData.cast);
    } else if (typeof updateData.cast === 'string') {
      // Handle comma-separated string
      updateData.cast = updateData.cast.split(',').map(c => c.trim()).filter(c => c);
    }

    // If a new file was uploaded, use the file path instead of URL
    if (req.file) {
      updateData.poster = `/uploads/${req.file.filename}`;
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete movie (Admin only)
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard stats (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await require('../models/User').countDocuments({});
    const totalBookings = await Booking.countDocuments({ paymentStatus: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalMovies,
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getDashboardStats
};
