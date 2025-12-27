const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Feedback = require('./models/Feedback');

const cleanupFeedback = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Get all user emails (normalized to lowercase as per User model)
        const users = await User.find({}, 'email');
        const userEmails = users.map(u => u.email.toLowerCase());
        console.log(`Found ${userEmails.length} active users.`);

        // Find all feedback
        const allFeedback = await Feedback.find({});
        console.log(`Found ${allFeedback.length} total feedback entries.`);

        let deletedCount = 0;
        const feedbackToDelete = [];

        for (const fb of allFeedback) {
            // Feedback email might need normalization too if not strictly validated on input
            if (!fb.email) continue;

            const fbEmail = fb.email.toLowerCase();
            if (!userEmails.includes(fbEmail)) {
                feedbackToDelete.push(fb._id);
                console.log(`Orphaned feedback found from: ${fb.email} (Message: ${fb.feedback.substring(0, 20)}...)`);
            }
        }

        if (feedbackToDelete.length > 0) {
            const result = await Feedback.deleteMany({
                _id: { $in: feedbackToDelete }
            });
            console.log(`Successfully deleted ${result.deletedCount} orphaned feedback entries.`);
        } else {
            console.log('No orphaned feedback found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

cleanupFeedback();
