const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const cleanupUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const adminName = 'himesh ambaliya';

        // Find users to delete
        const usersToDelete = await User.find({
            name: { $ne: adminName } // Case sensitive check as per instruction, could use regex for insensitive
        });

        // Let's do a case-insensitive check just to be safe and precise
        // We want to keep anyone whose name matches "himesh ambaliya" ignoring case?
        // User said "admin himesh ambaliya". Likely "Himesh Ambaliya" or "himesh ambaliya".
        // I I will confirm the exact casing in the DB first by printing everyone.

        const allUsers = await User.find({});
        console.log('Current Users:', allUsers.map(u => ({ id: u._id, name: u.name, email: u.email })));

        const keepUser = allUsers.find(u => u.name.toLowerCase() === adminName.toLowerCase());

        if (!keepUser) {
            console.error('CRITICAL: Admin user "himesh ambaliya" NOT FOUND. Aborting to prevent full lockout.');
            process.exit(1);
        }

        console.log(`Found admin to keep: ${keepUser.name} (${keepUser.email})`);

        const result = await User.deleteMany({
            _id: { $ne: keepUser._id }
        });

        console.log(`Deleted ${result.deletedCount} users.`);
        console.log('Remaining User:', (await User.find({})).map(u => u.name));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

cleanupUsers();
