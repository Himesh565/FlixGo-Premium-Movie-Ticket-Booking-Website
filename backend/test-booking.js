const axios = require('axios');

const testBooking = async () => {
  try {
    console.log('🧪 Testing Booking Flow...\n');
    
    // Step 1: Login to get token  
    console.log('1️⃣ Logging in as test user...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');
    
    // Step 2: Get available movies first, then shows
    console.log('2️⃣ Fetching available movies...');
    const moviesResponse = await axios.get('http://localhost:5000/api/movies');
    const movies = moviesResponse.data.data;
    
    if (movies.length === 0) {
      console.log('❌ No movies available');
      return;
    }
    
    const firstMovie = movies[0];
    console.log(`Found ${movies.length} movies, using: ${firstMovie.title}`);
    
    console.log('3️⃣ Fetching shows for movie...');
    const showsResponse = await axios.get(`http://localhost:5000/api/shows/movie/${firstMovie._id}`);
    const shows = showsResponse.data.data;
    
    if (shows.length === 0) {
      console.log('❌ No shows available');
      return;
    }
    
    // Find a show with available seats
    let selectedShow = null;
    let availableSeats = [];
    
    for (const show of shows) {
      const available = show.availableSeats?.filter(s => !s.isBooked) || [];
      if (available.length >= 2) {
        selectedShow = show;
        availableSeats = available;
        break;
      }
    }
    
    if (!selectedShow) {
      console.log('❌ No shows with available seats found');
      console.log('Total shows checked:', shows.length);
      return;
    }
    
    console.log(`✅ Found ${shows.length} shows, selected show with available seats:`, selectedShow._id);
    console.log(`   Movie: ${selectedShow.movieId?.title || 'Unknown'}`);
    console.log(`   Theater: ${selectedShow.theaterId?.name || 'Unknown'}`);
    console.log(`   Available seats: ${availableSeats.length}`);
    console.log(`   First few available: ${availableSeats.slice(0, 5).map(s => s.seatNumber).join(', ')}\n`);
    
    // Step 4: Attempt booking
    const seatsToBook = availableSeats.slice(0, 2).map(s => s.seatNumber);
    console.log(`4️⃣ Attempting to book seats ${seatsToBook.join(', ')}...`);
    const bookingData = {
      movieId: selectedShow.movieId._id || selectedShow.movieId,
      showId: selectedShow._id,
      seats: seatsToBook
    };
    
    console.log('Booking data:', JSON.stringify(bookingData, null, 2));
    
    const bookingResponse = await axios.post('http://localhost:5000/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Booking successful!');
    console.log('Booking ID:', bookingResponse.data.data.bookingId);
    console.log('Total Amount:', bookingResponse.data.data.totalAmount);
    
    // Step 5: Verify booking in user profile
    console.log('\n5️⃣ Checking user bookings...');
    const profileResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ User has ${profileResponse.data.data.length} booking(s)`);
    
  } catch (error) {
    console.error('❌ Error occurred:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Details:', error.response?.data?.error);
    console.error('Full error:', error.message);
    
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
};

testBooking();
