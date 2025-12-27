const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Theater = require('./models/Theater');

const sampleMovies = [
  {
    title: "Avengers: Endgame",
    genre: "Action",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    duration: 181,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    language: "English",
    rating: 8.4,
    trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson"],
    releaseDate: new Date("2019-04-26"),
    status: "active"
  },
  {
    title: "Spider-Man: No Way Home",
    genre: "Action",
    description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man.",
    duration: 148,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    language: "English",
    rating: 8.2,
    trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon", "Jon Favreau"],
    releaseDate: new Date("2021-12-17"),
    status: "active"
  },
  {
    title: "The Batman",
    genre: "Action",
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    duration: 176,
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    language: "English",
    rating: 7.8,
    trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright", "Colin Farrell"],
    releaseDate: new Date("2022-03-04"),
    status: "active"
  },
  {
    title: "Top Gun: Maverick",
    genre: "Action",
    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    duration: 131,
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    language: "English",
    rating: 8.3,
    trailer: "https://www.youtube.com/watch?v=qSqVVswa420",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm", "Glen Powell"],
    releaseDate: new Date("2022-05-27"),
    status: "active"
  },
  {
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi",
    description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, and the lengths they go to keep each other safe.",
    duration: 192,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    language: "English",
    rating: 7.6,
    trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"],
    releaseDate: new Date("2022-12-16"),
    status: "active"
  }
];

const sampleTheaters = [
  {
    name: "CineMax Downtown",
    location: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      pincode: "10001",
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851
      }
    },
    screens: [
      {
        screenNumber: "Screen 1",
        screenType: "Regular",
        totalSeats: 100,
        seatLayout: { rows: 10, seatsPerRow: 10 }
      },
      {
        screenNumber: "Screen 2",
        screenType: "Regular",
        totalSeats: 120,
        seatLayout: { rows: 12, seatsPerRow: 10 }
      },
      {
        screenNumber: "IMAX",
        screenType: "IMAX",
        totalSeats: 200,
        seatLayout: { rows: 20, seatsPerRow: 10 }
      }
    ],
    amenities: ["Parking", "Food Court", "Air Conditioning", "Security"],
    contact: {
      phone: "+1-555-0123",
      email: "downtown@cinemax.com"
    },
    operatingHours: {
      openTime: "09:00",
      closeTime: "23:00"
    },
    status: "active",
    rating: 4.5
  },
  {
    name: "MoviePlex Central",
    location: {
      address: "456 Broadway Avenue",
      city: "Los Angeles",
      state: "CA",
      pincode: "90210",
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    screens: [
      {
        screenNumber: "Screen 1",
        screenType: "Regular",
        totalSeats: 80,
        seatLayout: { rows: 8, seatsPerRow: 10 }
      },
      {
        screenNumber: "Screen 2",
        screenType: "Premium",
        totalSeats: 60,
        seatLayout: { rows: 6, seatsPerRow: 10 }
      },
      {
        screenNumber: "4DX",
        screenType: "4DX",
        totalSeats: 40,
        seatLayout: { rows: 4, seatsPerRow: 10 }
      }
    ],
    amenities: ["Restaurant", "ATM", "Wheelchair Access", "Air Conditioning"],
    contact: {
      phone: "+1-555-0456",
      email: "central@movieplex.com"
    },
    operatingHours: {
      openTime: "10:00",
      closeTime: "24:00"
    },
    status: "active",
    rating: 4.2
  },
  {
    name: "Grand Cinema Mall",
    location: {
      address: "789 Shopping Mall Drive",
      city: "Chicago",
      state: "IL",
      pincode: "60601",
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298
      }
    },
    screens: [
      {
        screenNumber: "Screen 1",
        screenType: "Regular",
        totalSeats: 150,
        seatLayout: { rows: 15, seatsPerRow: 10 }
      },
      {
        screenNumber: "Screen 2",
        screenType: "Regular",
        totalSeats: 150,
        seatLayout: { rows: 15, seatsPerRow: 10 }
      },
      {
        screenNumber: "Screen 3",
        screenType: "Dolby Atmos",
        totalSeats: 180,
        seatLayout: { rows: 18, seatsPerRow: 10 }
      }
    ],
    amenities: ["Food Court", "Parking", "Restaurant", "ATM", "Security"],
    contact: {
      phone: "+1-555-0789",
      email: "mall@grandcinema.com"
    },
    operatingHours: {
      openTime: "09:30",
      closeTime: "23:30"
    },
    status: "active",
    rating: 4.0
  }
];

const addSampleData = async () => {
  try {
    console.log('🎬 CineBook Sample Data Setup');
    console.log('=============================\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully!\n');

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@cinebook.com' });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@cinebook.com',
        password: hashedAdminPassword,
        role: 'admin',
        bookings: []
      });
      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // 2. Create Demo Regular User
    console.log('👤 Creating demo user...');
    const existingUser = await User.findOne({ email: 'demo@cinebook.com' });
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('demo123', 12);
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@cinebook.com',
        password: hashedUserPassword,
        role: 'user',
        bookings: []
      });
      await demoUser.save();
      console.log('✅ Demo user created');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // 3. Add Sample Theaters
    console.log('\n🏢 Adding sample theaters...');
    await Theater.deleteMany({}); // Clear existing theaters
    const createdTheaters = await Theater.insertMany(sampleTheaters);
    console.log(`✅ Added ${createdTheaters.length} theaters`);

    // 4. Add Sample Movies
    console.log('\n🎬 Adding sample movies...');
    await Movie.deleteMany({}); // Clear existing movies
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Added ${createdMovies.length} movies`);

    // 5. Create Sample Shows
    console.log('\n🎪 Creating sample shows...');
    await Show.deleteMany({}); // Clear existing shows

    const shows = [];
    const currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0); // Set time to 12:00 PM for base date

    // Distribute 1 show per movie
    for (let i = 0; i < createdMovies.length; i++) {
        const movie = createdMovies[i];
        
        // Cycle through theaters
        const theaterIndex = i % createdTheaters.length;
        const theater = createdTheaters[theaterIndex];

        // Use the first screen of the theater
        const screen = theater.screens[0];
        
        // Base price map
        const basePrices = {
            'Regular': 150,
            'Premium': 200,
            'IMAX': 350,
            '4DX': 400,
            'Dolby Atmos': 300
        };

        const showDate = new Date(currentDate);
        showDate.setDate(currentDate.getDate() + 1); // Tomorrow

        shows.push({
            movieId: movie._id,
            theaterId: theater._id,
            date: showDate,
            time: "10:00", // Fixed time for simplicity
            screen: screen.screenNumber,
            totalSeats: screen.totalSeats,
            price: basePrices[screen.screenType] || 250
        });
    }

    const createdShows = await Show.insertMany(shows);
    console.log(`✅ Added ${createdShows.length} shows`);

    // 6. Display Summary
    console.log('\n📊 Sample Data Summary:');
    console.log('=======================');
    console.log(`🎬 Movies: ${createdMovies.length}`);
    console.log(`🏢 Theaters: ${createdTheaters.length}`);
    console.log(`🎪 Shows: ${createdShows.length}`);
    console.log(`👥 Users: 2 (1 admin + 1 demo user)`);

    console.log('\n🔐 Login Credentials:');
    console.log('=====================');
    console.log('Admin Panel:');
    console.log('📧 Email: admin@cinebook.com');
    console.log('🔑 Password: admin123');
    console.log('🔗 URL: http://localhost:3000/admin/login\n');

    console.log('Demo User:');
    console.log('📧 Email: demo@cinebook.com');
    console.log('🔑 Password: demo123');
    console.log('🔗 URL: http://localhost:3000/login\n');

    console.log('🎯 What you can do now:');
    console.log('=======================');
    console.log('✅ Browse movies on the home page');
    console.log('✅ Login as demo user and book tickets');
    console.log('✅ Login as admin and manage movies/shows');
    console.log('✅ Test the complete booking flow');
    console.log('✅ View admin dashboard with statistics');

    console.log('\n🎉 Sample data setup completed successfully!');
    console.log('Your CineBook application is ready for demonstration!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up sample data:', error);
    process.exit(1);
  }
};

// Check if .env file exists and has required variables
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env file');
  console.log('Please make sure you have a .env file with MongoDB connection string');
  process.exit(1);
}

// Run the sample data setup
addSampleData();

