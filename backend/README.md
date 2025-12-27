# Movie Booking Backend

Express.js API with MongoDB for the movie booking system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (already created) and update the values:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens

3. Start MongoDB (make sure MongoDB is running)

4. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Movies
- `GET /api/movies` - Get all movies (public)
- `GET /api/movies/:id` - Get movie by ID (public)
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `GET /api/movies/admin/dashboard-stats` - Get dashboard stats (admin only)

### Shows
- `GET /api/shows/movie/:movieId` - Get shows for a movie (public)
- `GET /api/shows/:id` - Get show by ID (public)
- `POST /api/shows/book-seats` - Book seats (protected)
- `GET /api/shows` - Get all shows (admin only)
- `POST /api/shows` - Create show (admin only)
- `PUT /api/shows/:id` - Update show (admin only)
- `DELETE /api/shows/:id` - Delete show (admin only)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id/payment` - Update payment status (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)
- `GET /api/bookings` - Get all bookings (admin only)

## Database Models

- **User**: name, email, password, role, bookings
- **Movie**: title, genre, description, duration, poster, language, rating, etc.
- **Show**: movieId, date, time, screen, availableSeats, price
- **Booking**: userId, movieId, showId, seats, totalAmount, paymentStatus, etc.

The server runs on port 5000 by default.
