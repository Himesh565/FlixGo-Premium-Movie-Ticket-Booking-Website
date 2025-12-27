const mongoose = require('mongoose');
const Theater = require('./models/Theater');
require('dotenv').config();

const checkTheaters = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB\n');

        const theaters = await Theater.find({}).sort({ createdAt: -1 });
        console.log(`Total theaters in database: ${theaters.length}\n`);

        if (theaters.length === 0) {
            console.log('No theaters found in database.');
        } else {
            theaters.forEach((theater, index) => {
                console.log(`${index + 1}. ${theater.name}`);
                console.log(`   ID: ${theater._id}`);
                console.log(`   Status: ${theater.status}`);
                console.log(`   City: ${theater.location.city}`);
                console.log(`   Screens: ${theater.screens.length}`);
                console.log(`   Created: ${theater.createdAt}`);
                console.log('');
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkTheaters();
