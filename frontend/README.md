# Movie Booking Frontend

React.js frontend with Bootstrap for the movie booking system.

## Features

### User Pages
- **Login/Register**: Authentication with JWT
- **Home**: Browse movies with search and filters
- **Movie Details**: View movie information, cast, trailer, and show times
- **Seat Selection**: Interactive seat layout with booking
- **Confirmation**: Payment simulation and booking confirmation
- **Profile**: View/edit profile and booking history

### Admin Pages
- **Admin Login**: Separate admin authentication
- **Dashboard**: Statistics overview (movies, users, bookings, revenue)
- **Manage Movies**: Add, edit, delete movies
- **Manage Shows**: Schedule show times for movies

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Technology Stack

- **React 18**: UI library
- **React Router DOM**: Client-side routing
- **Bootstrap 5**: CSS framework for styling
- **Axios**: HTTP client for API calls
- **Context API**: State management for authentication

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── Navbar.js        # Navigation bar
│   ├── ProtectedRoute.js # Route protection for users
│   └── AdminRoute.js    # Route protection for admins
├── contexts/            # React Context providers
│   └── AuthContext.js   # Authentication state management
├── pages/               # Page components
│   ├── Login.js         # User login
│   ├── Register.js      # User registration
│   ├── Home.js          # Movie listing with search/filter
│   ├── MovieDetails.js  # Movie information and show times
│   ├── SeatSelection.js # Interactive seat booking
│   ├── Confirmation.js  # Payment and booking confirmation
│   ├── Profile.js       # User profile and booking history
│   └── admin/           # Admin pages
│       ├── AdminLogin.js    # Admin authentication
│       ├── AdminDashboard.js # Statistics dashboard
│       ├── AdminMovies.js   # Movie management
│       └── AdminShows.js    # Show scheduling
├── App.js               # Main app component
├── App.css             # Global styles
└── index.js            # Entry point
```

## Key Features

### Responsive Design
- Mobile-first approach with Bootstrap
- Adaptive layouts for all screen sizes
- Touch-friendly interface

### Authentication
- JWT-based authentication
- Role-based access control (user/admin)
- Persistent login sessions

### Movie Browsing
- Search by movie title
- Filter by genre and language
- Movie cards with ratings and details

### Seat Selection
- Interactive seat map
- Real-time seat availability
- Visual feedback for selection

### Payment Simulation
- Demo payment processing
- Booking confirmation
- Email-ready booking details

### Admin Panel
- Modern dashboard with statistics
- CRUD operations for movies and shows
- Intuitive management interface

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api/`

Main API endpoints used:
- `/auth/*` - Authentication
- `/movies/*` - Movie data
- `/shows/*` - Show scheduling
- `/bookings/*` - Booking management

## Environment Notes

- Backend API URL is hardcoded for development
- For production, use environment variables
- All API calls include JWT tokens when authenticated
