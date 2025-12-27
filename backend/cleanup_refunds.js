const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');

dotenv.config();

const cleanUpBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Count before delete
        const refundedCount = await Booking.countDocuments({ paymentStatus: 'refunded' });
        const failedCount = await Booking.countDocuments({ paymentStatus: 'failed' });

        console.log(`Found ${refundedCount} refunded bookings and ${failedCount} failed bookings.`);

        if (refundedCount > 0 || failedCount > 0) {
            // Delete refunded and failed
            const result = await Booking.deleteMany({
                paymentStatus: { $in: ['refunded', 'failed'] }
            });
            console.log(`Deleted ${result.deletedCount} bookings (refunded & failed).`);
        } else {
            console.log('No bookings to delete.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error cleaning up bookings:', error);
        process.exit(1);
    }
};

cleanUpBookings();
