import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback');
      if (response.data.success) {
        setFeedbacks(response.data.feedback || []);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash === '#movies') {
        setTimeout(() => {
          const moviesSection = document.getElementById('movies');
          if (moviesSection) {
            moviesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }
    if (selectedLanguage) {
      filtered = filtered.filter(movie =>
        movie.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }
    setFilteredMovies(filtered);
  };

  const getUniqueGenres = () => [...new Set(movies.map(movie => movie.genre))];
  const getUniqueLanguages = () => [...new Set(movies.map(movie => movie.language))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gold-400 text-lg font-semibold">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10"></div> {/* Vertical Fade */}

          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src="/assets/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-luxury font-bold text-white mb-4 animate-fade-in-up tracking-wider drop-shadow-2xl leading-tight">
              <span className="bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 bg-clip-text text-transparent bg-300% animate-shine">
                Unlimited Entertainment,
              </span>
              <br />
              <span className="text-white relative">
                One Click Away
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold-500/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200 max-w-3xl mx-auto font-light leading-relaxed">
              Immerse yourself in a world of stories. Secure your premium seats instantly and experience cinema like never before.
            </p>
            <button
              onClick={() => {
                const moviesSection = document.getElementById('movies');
                if (moviesSection) {
                  moviesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <span className="relative z-10 font-luxury font-bold tracking-[0.2em] text-black text-lg flex items-center gap-3">
                BROWSE MOVIES
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="container mx-auto px-4 py-24" id="movies">
        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="🔍 Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900">All Genres</option>
              {getUniqueGenres().map(genre => (
                <option key={genre} value={genre} className="bg-gray-900">{genre}</option>
              ))}
            </select>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900">All Languages</option>
              {getUniqueLanguages().map(language => (
                <option key={language} value={language} className="bg-gray-900">{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h4 className="text-2xl font-semibold text-white mb-2">No movies found</h4>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie._id}
                  className="group relative h-[500px] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Poster Background */}
                  <div className="absolute inset-0">
                    <img
                      src={
                        movie.poster
                          ? (movie.poster.startsWith('http')
                            ? movie.poster
                            : `http://localhost:5000${movie.poster}`
                          )
                          : 'https://via.placeholder.com/300x400?text=Movie+Poster'
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=Movie+Poster';
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-black/40 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 group-hover:border-gold-500 transition-colors">
                      <span className="text-gold-500 text-sm">★</span>
                      <span className="text-white font-bold text-sm">{movie.rating}</span>
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                      <h3 className="text-2xl font-bold font-luxury text-white mb-2 leading-tight group-hover:text-gold-400 transition-colors">
                        {movie.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-3 opacity-90">
                        <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                          {movie.genre}
                        </span>
                        <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                          {movie.duration} min
                        </span>
                        <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                          {movie.language}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto">
                        {movie.description}
                      </p>

                      <Link
                        to={`/movie/${movie._id}`}
                        className="w-full block bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold py-3.5 rounded-xl text-center transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-105"
                      >
                        Book Ticket
                      </Link>
                    </div>
                  </div>

                  {/* Gentle Border Glow */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500/30 rounded-3xl transition-colors duration-300 pointer-events-none"></div>
                </div>
              ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold font-luxury text-center text-white mb-12">
          Why Choose <span className="text-gold-500">FlixGo?</span>
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Seamless Booking",
              description: "Book your tickets in just a few clicks with our optimized and user-friendly interface.",
              icon: "🎫"
            },
            {
              title: "Premium Experience",
              description: "Enjoy a visual treat with our modern, dark-themed gold aesthetic designed for cinema lovers.",
              icon: "✨"
            },
            {
              title: "Secure Payments",
              description: "Your transactions are safe with us. We use top-tier encryption for all payment processes.",
              icon: "🔒"
            },
            {
              title: "24/7 Support",
              description: "Need help? Our dedicated support team is available round the clock to assist you.",
              icon: "🎧"
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl hover:border-gold-500/30 transition-all hover:-translate-y-1 group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Reviews Section */}
      <div className="container mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold font-luxury text-center text-white mb-12">
          User <span className="text-gold-500">Reviews</span>
        </h2>

        {feedbacks.length > 0 ? (
          <div
            className="relative overflow-hidden w-full group"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
          >
            {/* Scroll Track */}
            <div className="flex gap-6 w-max animate-scroll group-hover:paused">
              {/* Duplicate list for seamless infinite scroll */}
              {[...feedbacks, ...feedbacks].map((review, index) => (
                <div key={`${review._id}-${index}`} className="w-[400px] shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center font-bold font-luxury">
                        {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{review.name}</h4>
                        <span className="text-gray-500 text-xs">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-gold-500 text-sm">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed font-light">"{review.feedback}"</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10 bg-white/5 rounded-xl border border-dashed border-white/10 max-w-4xl mx-auto">
            <p>No reviews yet. Be the first to share your experience!</p>
            <Link to="/feedback" className="inline-block mt-4 text-gold-500 hover:underline">Write a Review</Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-shine {
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
        .bg-300\% { background-size: 300% auto; }
        .animate-blob { animation: blob 7s infinite; }
        
        /* Infinite Scroll Animation */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>
    </div >
  );
};

export default Home;
