const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cinebook.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@cinebook.com');
      console.log('You can update the role to admin if needed:');
      console.log('db.users.updateOne({ email: "admin@cinebook.com" }, { $set: { role: "admin" } })');
      process.exit(0);
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@cinebook.com',
      password: hashedPassword,
      role: 'admin',
      bookings: []
    });
    
    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Admin Login Credentials:');
    console.log('📧 Email: admin@cinebook.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('You can now access the admin panel at:');
    console.log('🔗 http://localhost:3000/admin/login');
    console.log('');
    console.log('Admin Features:');
    console.log('• Dashboard with statistics');
    console.log('• Manage movies (add, edit, delete)');
    console.log('• Schedule shows');
    console.log('• View all bookings');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 11000) {
      console.log('Admin user with this email already exists!');
      console.log('Try logging in with: admin@cinebook.com / admin123');
    }
    
    process.exit(1);
  }
};

// Display helpful information
console.log('🎬 CineBook Admin User Creator');
console.log('================================');
console.log('');

// Check if .env file exists and has required variables
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env file');
  console.log('');
  console.log('Please make sure you have a .env file in the backend directory with:');
  console.log('MONGODB_URI=your_mongodb_connection_string');
  console.log('JWT_SECRET=your_jwt_secret_key');
  process.exit(1);
}

// Run the admin creation
createAdmin();
