const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createTestUser = async () => {
  try {
    console.log('Creating test user...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete existing test user
    await User.deleteOne({ email: 'test@test.com' });
    
    // Create new test user (let the model handle password hashing)
    const testUser = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: 'test123', // Raw password - model will hash it
      role: 'user'
    });
    
    await testUser.save();
    console.log('✅ Test user created:');
    console.log('📧 Email: test@test.com');
    console.log('🔑 Password: test123');
    
    console.log('\n🔍 Verifying user...');
    const savedUser = await User.findOne({ email: 'test@test.com' });
    console.log('User found:', savedUser ? 'Yes' : 'No');
    
    if (savedUser) {
      console.log('Testing password comparison...');
      const isMatch = await savedUser.comparePassword('test123');
      console.log('Password match:', isMatch ? 'Yes' : 'No');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUser();
