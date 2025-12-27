const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // 1. Cleanup "Demo User" accounts
        const deleted = await User.deleteMany({ name: { $regex: /^Demo User/ } });
        console.log(`Deleted ${deleted.deletedCount} old "Demo User" accounts.`);

        // 2. Define Real Names
        const sampleUsers = [
            { name: "Rahul Sharma", email: "rahul.sharma@gmail.com" },
            { name: "Priya Patel", email: "priya.patel@gmail.com" },
            { name: "Amit Verma", email: "amit.verma@gmail.com" },
            { name: "Sneha Gupta", email: "sneha.gupta@gmail.com" },
            { name: "Vikram Singh", email: "vikram.singh@gmail.com" },
            { name: "Anjali Mehta", email: "anjali.mehta@gmail.com" },
            { name: "Rohan Das", email: "rohan.das@gmail.com" },
            { name: "Kavita Joshi", email: "kavita.joshi@gmail.com" },
            { name: "Arjun Reddy", email: "arjun.reddy@gmail.com" },
            { name: "Pooja Rani", email: "pooja.rani@gmail.com" }
        ];

        const hashedPassword = await bcrypt.hash('password123', 10);
        const usersToInsert = [];

        for (const user of sampleUsers) {
            // Check if user exists (to avoid duplicate key error if re-running)
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                usersToInsert.push({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: 'user'
                });
            }
        }

        if (usersToInsert.length > 0) {
            const docs = await User.insertMany(usersToInsert);
            console.log(`Successfully created ${docs.length} new users with realistic names.`);
        } else {
            console.log('All users already exist.');
        }

        console.log('\n--- Credentials ---');
        console.log('Examples:');
        console.log('User: Rahul Sharma -> rahul.sharma@gmail.com');
        console.log('User: Priya Patel  -> priya.patel@gmail.com');
        console.log('Password for all: password123');

    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

createUsers();
