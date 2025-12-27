const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  screens: [{
    screenNumber: {
      type: String,
      required: true
    },
    screenType: {
      type: String,
      enum: ['Regular', 'IMAX', '4DX', 'Dolby Atmos', 'Premium'],
      default: 'Regular'
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 100
    },
    seatLayout: {
      rows: {
        type: Number,
        default: 10
      },
      seatsPerRow: {
        type: Number,
        default: 10
      }
    }
  }],
  amenities: [{
    type: String,
    enum: ['Parking', 'Food Court', 'Restaurant', 'ATM', 'Wheelchair Access', 'Air Conditioning', 'Security']
  }],
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  operatingHours: {
    openTime: {
      type: String, // Format: "09:00"
      default: "09:00"
    },
    closeTime: {
      type: String, // Format: "23:00"
      default: "23:00"
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  image: {
    type: String, // URL to theater image
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.0
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
theaterSchema.index({ 'location.city': 1, status: 1 });
theaterSchema.index({ name: 'text', 'location.city': 'text' });

module.exports = mongoose.model('Theater', theaterSchema);
