const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  console.log('Pre-save: Hashing password for user:', this.email);
  console.log('Password before hashing:', this.password?.substring(0, 10) + '...');
  
  // Check if password is already hashed
  if (this.password && this.password.startsWith('$2b$') && this.password.length === 60) {
    console.log('Password already hashed, skipping');
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 12);
  console.log('Password hashed successfully');
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing passwords:');
    console.log('Candidate:', candidatePassword);
    console.log('Stored hash length:', this.password ? this.password.length : 'undefined');
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Comparison result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
