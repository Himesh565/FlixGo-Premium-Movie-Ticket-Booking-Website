const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Feedback = require('./backend/models/Feedback');

async function checkFeedback() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const feedback = await Feedback.find().sort({ createdAt: -1 });
        console.log('Total Feedback:', feedback.length);
        console.log('Latest Feedback:');
        feedback.forEach(f => {
            console.log(`- [${f.rating}★] ${f.name}: ${f.feedback} (${new Date(f.createdAt).toLocaleDateString()})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkFeedback();
