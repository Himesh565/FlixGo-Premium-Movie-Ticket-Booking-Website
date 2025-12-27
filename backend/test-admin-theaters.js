const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testAdminEndpoint = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const admin = await User.findOne({ email: 'admin@cinebook.com' });
        if (!admin) {
            console.log('Admin not found');
            process.exit(1);
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log('Testing: GET /api/theaters/admin/all\n');

        const response = await axios.get('http://localhost:5000/api/theaters/admin/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Status:', response.status);
        console.log('Success:', response.data.success);
        console.log('Number of theaters:', response.data.data.length);
        console.log('\nTheaters:');
        response.data.data.forEach((t, i) => {
            console.log(`${i + 1}. ${t.name} (${t.status}) - ${t.location.city}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        process.exit(1);
    }
};

testAdminEndpoint();
