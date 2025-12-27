const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');
const User = require('./models/User');
require('dotenv').config();

const createFeedback = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const sampleUsers = [
            { email: "rahul.sharma@gmail.com", rating: 5, msg: "Amazing experience! The booking process was so smooth." },
            { email: "priya.patel@gmail.com", rating: 4, msg: "Great app, but I wish there were more payment options." },
            { email: "amit.verma@gmail.com", rating: 5, msg: "Best movie booking platform I've used. Love the dark theme!" },
            { email: "sneha.gupta@gmail.com", rating: 5, msg: "FlixGo is fantastic. Quick and easy tickets." },
            { email: "vikram.singh@gmail.com", rating: 4, msg: "Good selection of movies and theaters." },
            { email: "anjali.mehta@gmail.com", rating: 5, msg: "Absolutely love it! The UI is stunning." },
            { email: "rohan.das@gmail.com", rating: 3, msg: "It's okay, sometimes the app loads a bit slowly on my phone." },
            { email: "kavita.joshi@gmail.com", rating: 5, msg: "Super convenient. No more standing in queues!" },
            { email: "arjun.reddy@gmail.com", rating: 4, msg: "Very user friendly. Highly recommended." },
            { email: "pooja.rani@gmail.com", rating: 5, msg: "Perfect app for movie buffs like me. 5 stars!" }
        ];

        // Clear existing feedback from these users to avoid duplicates if re-run
        const emails = sampleUsers.map(u => u.email);
        await Feedback.deleteMany({ email: { $in: emails } });
        console.log('Cleaned up old feedback from these users.');

        const feedbackToInsert = [];

        for (const data of sampleUsers) {
            const user = await User.findOne({ email: data.email });
            if (user) {
                feedbackToInsert.push({
                    name: user.name,
                    email: user.email,
                    rating: data.rating,
                    feedback: data.msg,
                    createdAt: new Date() // Current time
                });
            } else {
                console.warn(`User found not found: ${data.email}`);
            }
        }

        if (feedbackToInsert.length > 0) {
            await Feedback.insertMany(feedbackToInsert);
            console.log(`Successfully added ${feedbackToInsert.length} feedback entries.`);
        }

    } catch (error) {
        console.error('Error adding feedback:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

createFeedback();
