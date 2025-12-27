const Show = require('../models/Show');
const Movie = require('../models/Movie');

// Get shows by movie ID
const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { city } = req.query; // Optional city filter

    let query = { movieId };

    const shows = await Show.find(query)
      .populate('movieId')
      .populate('theaterId');

    // Filter out shows from inactive theaters
    let activeShows = shows.filter(show =>
      show.theaterId && show.theaterId.status === 'active'
    );

    // Filter by city if provided
    let filteredShows = activeShows;
    if (city) {
      filteredShows = activeShows.filter(show =>
        show.theaterId.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredShows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get show by ID
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theaterId');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all shows (Admin only)
const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate('movieId')
      .populate('theaterId');

    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create show (Admin only)
const createShow = async (req, res) => {
  try {
    const { movieId, theaterId } = req.body;

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Verify theater exists
    const theater = await require('../models/Theater').findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    const show = new Show(req.body);
    await show.save();

    const populatedShow = await Show.findById(show._id)
      .populate('movieId')
      .populate('theaterId');

    res.status(201).json({
      success: true,
      data: populatedShow
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update show (Admin only)
const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('movieId');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete show (Admin only)
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book seats - DEPRECATED: Now handled atomically in booking creation
// This function is kept for backward compatibility but is no longer used
const bookSeats = async (req, res) => {
  try {
    res.status(400).json({
      message: 'Direct seat booking is deprecated. Please use the booking system instead.',
      redirect: '/api/bookings'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getShowsByMovie,
  getShowById,
  getAllShows,
  createShow,
  updateShow,
  deleteShow,
  bookSeats
};
