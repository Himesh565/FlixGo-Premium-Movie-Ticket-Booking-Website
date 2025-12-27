const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { movieId, showId, seats } = req.body;
    const userId = req.user._id;

    console.log('Creating booking for user:', userId, 'Show:', showId, 'Seats:', seats);

    // Validate input
    if (!movieId || !showId) {
      return res.status(400).json({ message: 'Movie ID and Show ID are required' });
    }

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: 'No seats selected' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get show details and check availability
    const show = await Show.findById(showId).populate('movieId').populate('theaterId');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if all selected seats are available
    const unavailableSeats = [];
    seats.forEach(seatNumber => {
      const seat = show.availableSeats.find(s => s.seatNumber === seatNumber);
      if (!seat || seat.isBooked) {
        unavailableSeats.push(seatNumber);
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(', ')} are not available`,
        unavailableSeats
      });
    }

    const totalAmount = seats.length * show.price;

    // Create booking first
    const booking = new Booking({
      userId,
      movieId,
      showId,
      seats,
      totalAmount,
      paymentStatus: 'pending' // Default to pending until payment is verified
    });

    const savedBooking = await booking.save();
    console.log('Booking saved:', savedBooking._id);

    // Then book the seats
    try {
      seats.forEach(seatNumber => {
        const seat = show.availableSeats.find(s => s.seatNumber === seatNumber);
        if (seat && !seat.isBooked) {
          seat.isBooked = true;
        }
      });
      await show.save();
      console.log('Seats marked as booked');
    } catch (seatError) {
      // If seat booking fails, remove the booking
      await Booking.findByIdAndDelete(savedBooking._id);
      throw new Error('Failed to book seats: ' + seatError.message);
    }

    // Update user's bookings
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { bookings: savedBooking._id }
      });
      console.log('User bookings updated');
    } catch (userError) {
      console.warn('Failed to update user bookings, but booking is valid:', userError.message);
    }

    // Populate booking details
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('movieId')
      .populate({
        path: 'showId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .populate('userId', 'name email');

    console.log('Booking created successfully:', savedBooking._id);

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Stack trace:', error.stack);

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Booking already exists',
        error: 'Duplicate booking detected'
      });
    }

    res.status(500).json({
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate('movieId')
      .populate({
        path: 'showId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate({
        path: 'showId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus },
      { new: true }
    ).populate('movieId').populate({
      path: 'showId',
      populate: {
        path: 'theaterId',
        model: 'Theater'
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('movieId')
      .populate({
        path: 'showId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .populate('userId', 'name email')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update booking status to refunded
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release the seats back to the show
    const show = await Show.findById(booking.showId);
    if (show) {
      booking.seats.forEach(seatNumber => {
        const seat = show.availableSeats.find(s => s.seatNumber === seatNumber);
        if (seat) {
          seat.isBooked = false;
        }
      });
      await show.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updatePaymentStatus,
  getAllBookings,
  cancelBooking
};
