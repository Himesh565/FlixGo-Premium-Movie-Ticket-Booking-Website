const Theater = require('../models/Theater');
const Show = require('../models/Show');

// Get all theaters (public - active only)
const getAllTheaters = async (req, res) => {
  try {
    const { city, search } = req.query;
    let query = { status: 'active' };

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const theaters = await Theater.find(query).sort({ 'location.city': 1, name: 1 });

    res.json({
      success: true,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all theaters (admin - all statuses)
const getAllTheatersAdmin = async (req, res) => {
  try {
    const theaters = await Theater.find({}).sort({ 'location.city': 1, name: 1 });

    res.json({
      success: true,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get theater by ID
const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({
      success: true,
      data: theater
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get theaters by city
const getTheatersByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const theaters = await Theater.find({
      'location.city': { $regex: city, $options: 'i' },
      status: 'active'
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: theaters
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create theater (Admin only)
const createTheater = async (req, res) => {
  try {
    const theaterData = { ...req.body };

    // Parse JSON fields if they are strings (from FormData)
    ['location', 'screens', 'amenities', 'contact', 'operatingHours'].forEach(field => {
      if (theaterData[field] && typeof theaterData[field] === 'string') {
        try {
          theaterData[field] = JSON.parse(theaterData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle file upload
    if (req.file) {
      theaterData.image = `/uploads/${req.file.filename}`;
    }

    const theater = new Theater(theaterData);
    await theater.save();

    res.status(201).json({
      success: true,
      data: theater
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update theater (Admin only)
const updateTheater = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Parse JSON fields if they are strings (from FormData)
    ['location', 'screens', 'amenities', 'contact', 'operatingHours'].forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle file upload
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({
      success: true,
      data: theater
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Hard delete theater (Admin only)
const deleteTheater = async (req, res) => {
  try {
    // 1. Check if there are any shows scheduled for this theater
    const existingShows = await Show.find({ theaterId: req.params.id });

    if (existingShows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete theater. There are shows scheduled for this theater. Please cancel them first or mark theater as Inactive.'
      });
    }

    // 2. Perform Hard Delete
    const theater = await Theater.findByIdAndDelete(req.params.id);

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({
      success: true,
      message: 'Theater permanently deleted successfully',
      data: theater
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all cities (for dropdown)
const getCities = async (req, res) => {
  try {
    const cities = await Theater.distinct('location.city', { status: 'active' });

    res.json({
      success: true,
      data: cities.sort()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get theater statistics (Admin only)
const getTheaterStats = async (req, res) => {
  try {
    const totalTheaters = await Theater.countDocuments();
    const activeTheaters = await Theater.countDocuments({ status: 'active' });
    const inactiveTheaters = await Theater.countDocuments({ status: 'inactive' });
    const maintenanceTheaters = await Theater.countDocuments({ status: 'maintenance' });

    const citiesCount = await Theater.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $count: 'totalCities' }
    ]);

    const screenTypes = await Theater.aggregate([
      { $unwind: '$screens' },
      { $group: { _id: '$screens.screenType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalTheaters,
        activeTheaters,
        inactiveTheaters,
        maintenanceTheaters,
        totalCities: citiesCount[0]?.totalCities || 0,
        screenTypes
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTheaters,
  getAllTheatersAdmin,
  getTheaterById,
  getTheatersByCity,
  createTheater,
  updateTheater,
  deleteTheater,
  getCities,
  getTheaterStats
};
