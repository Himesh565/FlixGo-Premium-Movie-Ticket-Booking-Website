# 🎬 FlixGo - Premium Movie Ticket Booking Website


> **Experience Cinema Like Never Before.**  
> A full-stack MERN application for booking movie tickets with a premium, glassmorphism-inspired UI and a comprehensive admin dashboard.
---

## 📋 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

---

## 📖 About the Project

**FlixGo** is a modern web application designed to simplify the movie ticket booking process. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a seamless experience for users to browse movies, select seats, and book tickets. For administrators, it provides a powerful, secure dashboard to manage the entire cinema ecosystem including movies, theaters, and showtimes.

The application features a distinct **Dark & Gold luxury aesthetic**, utilizing advanced CSS effects like glassmorphism and smooth animations to provide a premium look and feel.

---

## ✨ Key Features

### 👤 User Features
-   **Authentication**: Secure Sign Up and Login with JWT authentication.
-   **Movie Browsing**: Browse currently running movies with filtering options.
-   **Dynamic Details**: View movie trailers, ratings, and cast details.
-   **Seat Selection**: Interactive, real-time seat map to choose your preferred seats.
-   **Booking System**: Seamless booking flow with integrated payment gateway (Razorpay/Mock).
-   **User Dashboard**: View booking history, profile management, and downloadable tickets.
-   **Feedback System**: Submit reviews and ratings for movies.
-   **Infinite Reviews**: Smooth scrolling marquee of user testimonials.

### 🛡️ Admin Portal
-   **Secure Login**: Dedicated admin login with credential verification.
-   **Dashboard**: Overview of system stats (Total Users, Bookings, Revenue).
-   **Movie Management**: Add, edit, or delete movies with poster and trailer support.
-   **Theater Management**: Onboard new theaters, manage screens and amenities.
-   **Show Scheduling**: Schedule shows with specific dates, times, and pricing.
-   **User Management**: View and manage registered users.
-   **Feedback Moderation**: View user feedback and reviews.

---

## 🛠️ Technology Stack

### Frontend
-   **React.js**: Component-based UI library.
-   **Tailwind CSS**: Utility-first CSS framework for rapid styling.
-   **Vite**: Next-generation frontend tooling.
-   **Axios**: For handling HTTP requests.
-   **React Router**: For client-side routing.
-   **Lucide React**: Beautiful icons.

### Backend
-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web application framework.
-   **MongoDB**: NoSQL database for flexible data storage.
-   **Mongoose**: ODM library for MongoDB and Node.js.
-   **JWT (JSON Web Tokens)**: Secure user authentication.
-   **Bcrypt.js**: Password hashing for security.

---

## 📂 Project Structure

```text
project-app/
├── backend/                # Node.js & Express Backend
│   ├── controllers/        # Request logic (Auth, Movies, Shows, etc.)
│   ├── models/             # Mongoose Schemas (User, Booking, etc.)
│   ├── routes/             # API Routes definition
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Entry point
│   └── .env                # Backend environment variables
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Modal, etc.)
│   │   ├── pages/          # Page components (Home, Login, Admin Dashboard)
│   │   ├── contexts/       # React Context (Auth State)
│   │   └── App.jsx         # Main App component
│   └── index.html
│
└── README.md               # Project Documentation
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
-   **Node.js** (v14 or higher)
-   **MongoDB** (Local or Atlas URL)
-   **Git**

---

## 💿 Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/flixgo-movie-booking.git
    cd flixgo-movie-booking
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

*(Optional)* Create a `.env` file in the `frontend/` directory if required for API URLs, though defaults are set to `localhost:5000`.

---

## ▶️ Running the Project

You can run both servers concurrently or separately.

### Option 1: Using provided scripts (Windows)
Double-click `start-demo.bat` in the root directory.

### Option 2: Manual Start

**1. Start Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**2. Start Frontend Application:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Himesh Ambaliya**
