const mongoose = require('mongoose');
require('dotenv').config();

const Show = require('./models/Show');

const resetSeats = async () => {
  try {
    console.log('🔄 Resetting seats in all shows...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all shows
    const shows = await Show.find({});
    console.log(`Found ${shows.length} shows`);
    
    let updatedShows = 0;
    
    for (const show of shows) {
      let updated = false;
      
      // Check if seats need to be reset
      const bookedSeats = show.availableSeats?.filter(seat => seat.isBooked).length || 0;
      
      if (bookedSeats > 0) {
        // Reset all seats to available
        show.availableSeats.forEach(seat => {
          seat.isBooked = false;
        });
        await show.save();
        updated = true;
        updatedShows++;
      }
      
      console.log(`Show ${show._id}: ${show.availableSeats?.length || 0} total seats, ${bookedSeats} were booked${updated ? ' - RESET' : ''}`);
    }
    
    console.log(`\n✅ Reset completed!`);
    console.log(`📊 Updated ${updatedShows} shows`);
    console.log(`🎫 All seats are now available for booking`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetSeats();
