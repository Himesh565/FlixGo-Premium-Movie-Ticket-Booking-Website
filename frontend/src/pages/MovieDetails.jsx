import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [groupedShows, setGroupedShows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [id]);

  useEffect(() => {
    if (shows.length > 0) {
      // Extract unique dates
      const dates = [...new Set(shows.map(show => {
        const d = new Date(show.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      }))].sort();

      setAvailableDates(dates);
      if (!selectedDate && dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
  }, [shows]);

  useEffect(() => {
    if (shows.length > 0 && selectedDate) {
      const filtered = shows.filter(show => {
        const d = new Date(show.date);
        const s = new Date(selectedDate);
        return d.getDate() === s.getDate() &&
          d.getMonth() === s.getMonth() &&
          d.getFullYear() === s.getFullYear();
      });

      const grouped = {};
      filtered.forEach(show => {
        const theaterId = show.theaterId._id;
        if (!grouped[theaterId]) {
          grouped[theaterId] = {
            theater: show.theaterId,
            shows: []
          };
        }
        grouped[theaterId].shows.push(show);
      });
      setGroupedShows(grouped);
    } else {
      setGroupedShows({});
    }
  }, [selectedDate, shows]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setMovie(response.data.data);
    } catch (error) {
      setError('Movie not found');
      console.error('Error fetching movie:', error);
    }
  };

  const fetchShows = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shows/movie/${id}`);
      setShows(response.data.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDayNumber = (dateString) => {
    return new Date(dateString).getDate();
  };

  const getMonthName = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const handleBookNow = (showId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/seat-selection/${showId}`);
  };

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(selectedTheater?._id === theater._id ? null : theater);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gold-400 text-lg font-semibold">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-gold-600/30">
          <h2 className="text-red-500 text-2xl font-bold mb-4">{error || 'Movie not found'}</h2>
          <Link to="/" className="inline-block px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-400 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Immersive Blurred Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={movie.poster ? (movie.poster.startsWith('http') ? movie.poster : `http://localhost:5000${movie.poster}`) : 'https://via.placeholder.com/400x600'}
          alt="background"
          className="w-full h-full object-cover blur-[100px] opacity-30 scale-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back Navigation */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-gold-400 transition-colors mb-8 group bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-gold-500/30"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span>
            Back to Movies
          </Link>

          {/* Movie Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 animate-fade-in-up">
            {/* Left: Poster */}
            <div className="lg:col-span-4 lg:col-start-2">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.15)] border-2 border-white/10 group">
                <img
                  src={movie.poster ? (movie.poster.startsWith('http') ? movie.poster : `http://localhost:5000${movie.poster}`) : 'https://via.placeholder.com/400x600'}
                  alt={movie.title}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Movie+Poster'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gold-500/90 backdrop-blur-md text-black font-bold px-3 py-1 rounded-full text-sm">
                  ⭐ {movie.rating}/10
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-6 text-white space-y-8 flex flex-col justify-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-luxury font-bold bg-gradient-to-r from-white via-gold-200 to-gold-500 bg-clip-text text-transparent tracking-tight mb-4 drop-shadow-2xl">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm tracking-wide">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-gold-300 font-semibold">
                    {movie.genre}
                  </span>
                  <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-gray-300">
                    {movie.language}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <span className="text-lg">⏱️</span> {movie.duration} mins
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <span className="text-lg">📅</span> {formatDate(movie.releaseDate)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold font-luxury text-gold-500 mb-3 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-gold-500 inline-block"></span> Synopsis
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {movie.description}
                </p>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Top Cast</h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.cast.map((actor, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full pl-1 pr-4 py-1 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xs">
                          {actor.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">{actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.trailer && (
                <div className="pt-4">
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl text-white font-semibold hover:border-gold-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all group"
                  >
                    <span className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                    Watch Trailer
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shows Section */}
          <div className="animate-fade-in-up animation-delay-200" id="bookings">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-4xl font-bold font-luxury text-white mb-2">
                  Showtimes
                </h3>
                <p className="text-gray-500 font-light">Select date to view available shows</p>
              </div>

              {/* Date Selector */}
              {availableDates.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {availableDates.map(date => {
                    const isSelected = selectedDate === date;
                    const dateObj = new Date(date);
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-xl border transition-all ${isSelected
                          ? 'bg-gold-500 border-gold-500 text-black shadow-lg shadow-gold-500/20 scale-110'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-gold-500/30'
                          }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">{getDayName(date)}</span>
                        <span className="text-xl font-bold">{getDayNumber(date)}</span>
                        <span className="text-[10px] uppercase opacity-80">{getMonthName(date)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {Object.keys(groupedShows).length === 0 ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-16 text-center border border-dashed border-white/10">
                <div className="text-6xl mb-6 opacity-30">🎬</div>
                <h5 className="text-2xl text-white mb-2 font-luxury">No shows scheduled for this date</h5>
                <p className="text-gray-400">Please select another date or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(groupedShows).map(theaterId => {
                  const { theater, shows: theaterShows } = groupedShows[theaterId];
                  // shows are already filtered by date in useEffect

                  return (
                    <div
                      key={theaterId}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all flex flex-col md:flex-row gap-6 md:gap-12 md:items-center"
                    >
                      {/* Theater Info */}
                      <div className="md:w-1/3">
                        <div className="flex items-center gap-3 mb-2">
                          {/* Theater Logo */}
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-gray-800 flex-shrink-0">
                            <img
                              src={
                                theater.image
                                  ? (theater.image.startsWith('http')
                                    ? theater.image
                                    : `http://localhost:5000${theater.image}`)
                                  : 'https://via.placeholder.com/100x100?text=Theater'
                              }
                              alt={theater.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=🎬';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gold-500">🤍</span>
                              <h5 className="text-lg font-bold text-white hover:text-gold-400 transition-colors cursor-pointer">
                                {theater.name}
                              </h5>
                            </div>
                            <p className="text-gray-400 text-xs">{theater.location.city}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm ml-15 mb-2">{theater.location.address}</p>
                        <div className="flex gap-2 ml-15">
                          <span className="text-[10px] text-green-400 flex items-center gap-1">
                            ● M-Ticket
                          </span>
                          <span className="text-[10px] text-orange-400 flex items-center gap-1">
                            ● F&B
                          </span>
                        </div>
                      </div>

                      {/* Shows List */}
                      <div className="flex-1 flex flex-wrap gap-4 items-center">
                        {theaterShows.map(show => {
                          const availableSeats = show.availableSeats.filter(s => !s.isBooked).length;
                          const isSoldOut = availableSeats === 0;
                          const isFastFilling = availableSeats < 20 && !isSoldOut;

                          return (
                            <div key={show._id} className="relative group/tooltip">
                              <button
                                onClick={() => !isSoldOut && handleBookNow(show._id)}
                                disabled={isSoldOut}
                                className={`px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all ${isSoldOut
                                  ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                                  : 'bg-transparent border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                  }`}
                              >
                                {show.time}
                                <span className="block text-[10px] opacity-70 font-normal mt-0.5">
                                  {show.screen}
                                </span>
                              </button>

                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 border border-white/20 rounded-lg p-2 text-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                <div className="text-gold-400 font-bold mb-1">₹{show.price}</div>
                                <div className={`text-[10px] ${isSoldOut ? 'text-red-400' : isFastFilling ? 'text-orange-400' : 'text-green-400'}`}>
                                  {isSoldOut ? 'Sold Out' : isFastFilling ? 'Fast Filling' : 'Available'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
};

export default MovieDetails;
