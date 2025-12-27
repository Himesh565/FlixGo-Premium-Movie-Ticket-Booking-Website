const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true // format: "HH:MM"
  },
  screen: {
    type: String,
    required: true,
    trim: true
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  availableSeats: [{
    seatNumber: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Initialize available seats when show is created
showSchema.pre('save', function(next) {
  if (this.isNew && this.availableSeats.length === 0) {
    const rows = 10;
    const seatsPerRow = 10;
    
    for (let row = 0; row < rows; row++) {
      const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
      
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        this.availableSeats.push({
          seatNumber: `${rowLabel}${seat}`,
          isBooked: false
        });
      }
    }
  }
  next();
});

module.exports = mongoose.model('Show', showSchema);
