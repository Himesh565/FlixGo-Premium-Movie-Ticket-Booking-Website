const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const testAdmin = async () => {
  try {
    console.log('🔍 Checking admin user...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@cinebook.com' });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Name:', admin.name);
      
      // Test password
      const isValidPassword = await bcrypt.compare('admin123', admin.password);
      console.log('   Password valid:', isValidPassword ? '✅' : '❌');
      
      if (admin.role !== 'admin') {
        console.log('⚠️  WARNING: User exists but role is not "admin"');
        console.log('   Updating role to admin...');
        admin.role = 'admin';
        await admin.save();
        console.log('   ✅ Role updated to admin');
      }
    } else {
      console.log('❌ Admin user not found');
      console.log('   Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@cinebook.com',
        password: hashedPassword,
        role: 'admin',
        bookings: []
      });
      
      await newAdmin.save();
      console.log('   ✅ Admin user created successfully');
    }
    
    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Email: admin@cinebook.com');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdmin();
