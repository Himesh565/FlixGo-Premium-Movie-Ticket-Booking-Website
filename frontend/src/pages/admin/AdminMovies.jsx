import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminMovies = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    duration: '',
    poster: '',
    language: '',
    rating: '',
    trailer: '',
    cast: '',
    releaseDate: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that either a file is selected or URL is provided
    if (!selectedFile && !formData.poster) {
      toast.error('Please select a poster file or enter a poster URL');
      return;
    }

    try {
      let dataToSend;
      let config = {};

      if (selectedFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();

        formDataToSend.append('title', formData.title);
        formDataToSend.append('genre', formData.genre);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('duration', parseInt(formData.duration));
        formDataToSend.append('language', formData.language);
        formDataToSend.append('rating', parseFloat(formData.rating));
        formDataToSend.append('trailer', formData.trailer);
        formDataToSend.append('releaseDate', new Date(formData.releaseDate).toISOString());
        formDataToSend.append('cast', formData.cast);
        formDataToSend.append('poster', selectedFile);

        dataToSend = formDataToSend;
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else {
        // Use JSON for URL-based poster
        dataToSend = {
          title: formData.title,
          genre: formData.genre,
          description: formData.description,
          duration: parseInt(formData.duration),
          language: formData.language,
          rating: parseFloat(formData.rating),
          trailer: formData.trailer,
          releaseDate: new Date(formData.releaseDate).toISOString(),
          cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean),
          poster: formData.poster
        };
        config = { headers: { 'Content-Type': 'application/json' } };
      }

      if (editingMovie) {
        await axios.put(`http://localhost:5000/api/movies/${editingMovie._id}`, dataToSend, config);
        toast.success('Movie updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/movies', dataToSend, config);
        toast.success('Movie added successfully!');
      }

      setShowModal(false);
      setEditingMovie(null);
      resetForm();
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
      toast.error(error.response?.data?.message || 'Error saving movie. Please try again.');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      duration: movie.duration.toString(),
      poster: movie.poster,
      language: movie.language,
      rating: movie.rating.toString(),
      trailer: movie.trailer || '',
      cast: movie.cast.join(', '),
      releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0]
    });

    // Clear file selection when editing
    setSelectedFile(null);
    setPreviewUrl(null);

    setShowModal(true);
  };

  const handleDelete = (movieId) => {
    setMovieToDelete(movieId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (movieToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${movieToDelete}`);
        toast.success('Movie deleted successfully');
        fetchMovies();
        setShowDeleteModal(false);
        setMovieToDelete(null);
      } catch (error) {
        console.error('Error deleting movie:', error);
        toast.error('Error deleting movie. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      description: '',
      duration: '',
      poster: '',
      language: '',
      rating: '',
      trailer: '',
      cast: '',
      releaseDate: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear URL input if file is selected
      setFormData({ ...formData, poster: '' });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleTagInput = (e, field) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim().replace(',', '');
      if (value) {
        const currentTags = formData[field] ? formData[field].split(',').map(t => t.trim()).filter(Boolean) : [];
        if (!currentTags.includes(value)) {
          setFormData({
            ...formData,
            [field]: [...currentTags, value].join(', ')
          });
        }
        e.target.value = '';
      }
    }
  };

  const removeTag = (field, tagToRemove) => {
    const currentTags = formData[field].split(',').map(t => t.trim());
    setFormData({
      ...formData,
      [field]: currentTags.filter(tag => tag !== tagToRemove).join(', ')
    });
  };

  const renderTagInputHelp = (field) => {
    const tags = formData[field] ? formData[field].split(',').map(t => t.trim()).filter(Boolean) : [];
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gold-500/20 text-gold-500 text-xs rounded-full flex items-center gap-1 border border-gold-500/30">
            {tag}
            <button type="button" onClick={() => removeTag(field, tag)} className="hover:text-white">×</button>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-gold-500 font-luxury font-bold text-xl tracking-wide hover:text-gold-400 transition-colors">
            <span className="text-2xl">🎬</span> FlixGo Admin
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/movies" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
            <span>🎬</span> Manage Movies
          </Link>
          <Link to="/admin/shows" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>🎪</span> Manage Shows
          </Link>
          <Link to="/admin/theaters" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>🏢</span> Manage Theaters
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>👥</span> Users
          </Link>
          <Link to="/admin/feedback" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>💬</span> Feedback
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 text-white mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="truncate font-semibold text-sm">{user?.name}</div>
              <div className="truncate text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="md:hidden bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold font-luxury text-white">Manage Movies</h1>
          <button className="text-gray-400">☰</button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-luxury text-white mb-2">Movies Database</h1>
              <p className="text-gray-400">Add, edit, or remove movies from the catalog.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingMovie(null);
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-colors flex items-center gap-2 shadow-lg shadow-gold-500/20 group"
            >
              <span className="group-hover:rotate-90 transition-transform">➕</span> Add New Movie
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4">Poster</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Genre</th>
                      <th className="p-4">Language</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Release</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies.map(movie => (
                      <tr key={movie._id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <img
                            src={
                              movie.poster
                                ? (movie.poster.startsWith('http')
                                  ? movie.poster
                                  : `http://localhost:5000${movie.poster}`
                                )
                                : 'https://via.placeholder.com/50x75?text=Poster'
                            }
                            alt={movie.title}
                            className="w-12 h-18 object-cover rounded-lg border border-white/10 group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x75?text=Poster';
                            }}
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white mb-1">{movie.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{movie.description}</div>
                        </td>
                        <td className="p-4 text-gray-300">
                          {movie.genre.split(',').map((g, i) => (
                            <span key={i} className="inline-block px-2 py-0.5 bg-white/5 rounded-full text-xs mr-1 mb-1">{g.trim()}</span>
                          ))}
                        </td>
                        <td className="p-4 text-gray-300 text-sm">
                          <span className="px-2 py-1 bg-white/10 rounded-md border border-white/10">{movie.language}</span>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{movie.duration} min</td>
                        <td className="p-4 text-gold-400 font-bold">⭐ {movie.rating}</td>
                        <td className="p-4 text-gray-400 text-sm">{formatDate(movie.releaseDate)}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(movie)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(movie._id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {movies.length === 0 && (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-gray-500">
                          No movies found. Add your first movie to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modern Split Modal with Grid */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 z-10">
              <div>
                <h2 className="text-2xl font-bold font-luxury text-white">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </h2>
                <p className="text-gray-400 text-sm">Fill in the details to add a movie to the catalog.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-xl"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* LEFT COLUMN: SCROLLABLE FORM (60%) */}
              <div className="lg:col-span-7 overflow-y-auto p-8 border-r border-white/5 bg-gradient-to-br from-gray-900 to-black/50">
                <form id="movieForm" onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2">Basic Details</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Movie Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-gray-600"
                          placeholder="e.g. Avengers: Endgame"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Duration (mins)</label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                          placeholder="e.g. 180"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Rating (1-10)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                          placeholder="e.g. 8.5"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Language</label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none appearance-none"
                          required
                        >
                          <option value="">Select Language</option>
                          <option value="Hindi">Hindi</option>
                          <option value="English">English</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Release Date</label>
                        <input
                          type="date"
                          name="releaseDate"
                          value={formData.releaseDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2">Media & Content</h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Movie Poster</label>
                      <div className="p-4 border-2 border-dashed border-white/10 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="posterUpload"
                          />
                          <label htmlFor="posterUpload" className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                            Choose File
                          </label>
                          <span className="text-gray-500 text-sm">OR</span>
                          <input
                            type="url"
                            name="poster"
                            value={formData.poster}
                            onChange={handleInputChange}
                            placeholder="Paste Image URL"
                            className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-gold-500 outline-none"
                            disabled={selectedFile !== null}
                          />
                        </div>
                        {selectedFile && (
                          <div className="mt-2 text-green-400 text-xs flex items-center gap-2">
                            ✓ Selected: {selectedFile.name}
                            <button type="button" onClick={clearFile} className="text-red-400 hover:underline">Remove</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none resize-none"
                        placeholder="Plot summary..."
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Trailer URL</label>
                      <input
                        type="url"
                        name="trailer"
                        value={formData.trailer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  {/* Metadata Section with Tags */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2">Classification</h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Genre (Type & Enter)</label>
                      <input
                        type="text"
                        onKeyDown={(e) => handleTagInput(e, 'genre')}
                        placeholder="e.g. Action, Sci-Fi (Press Enter)"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                      />
                      <input type="hidden" name="genre" value={formData.genre} required />
                      {renderTagInputHelp('genre')}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Cast (Type & Enter)</label>
                      <input
                        type="text"
                        onKeyDown={(e) => handleTagInput(e, 'cast')}
                        placeholder="e.g. Robert Downey Jr. (Press Enter)"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                      />
                      <input type="hidden" name="cast" value={formData.cast} />
                      {renderTagInputHelp('cast')}
                    </div>
                  </div>

                </form>
              </div>

              {/* RIGHT COLUMN: LIVE PREVIEW (40%) */}
              <div className="lg:col-span-5 bg-black p-8 flex flex-col items-center justify-center border-l border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-500/5 blur-3xl"></div>

                <h3 className="uppercase text-xs font-bold text-gray-500 tracking-widest mb-6 z-10">Live Preview Card</h3>

                {/* Preview Card */}
                <div className="w-full max-w-sm bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative z-10 group">
                  <div className="relative aspect-[2/3] w-full bg-gray-800 overflow-hidden">
                    <img
                      src={previewUrl || (formData.poster?.startsWith('http') ? formData.poster : `http://localhost:5000${formData.poster}`)}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {formData.genre.split(',').slice(0, 3).filter(Boolean).map((g, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-1 bg-gold-500 text-black rounded uppercase tracking-wider">{g.trim()}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold text-white font-luxury leading-tight mb-1">
                        {formData.title || 'Movie Title'}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span>{formData.duration ? `${formData.duration} min` : '-- min'}</span>
                        <span>•</span>
                        <span>{formData.language || 'Language'}</span>
                        <span>•</span>
                        <span className="text-gold-400 font-bold">⭐ {formData.rating || '0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                      {formData.description || 'Description will appear here...'}
                    </p>
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                      {formData.cast.split(',').filter(Boolean).map((actor, i) => (
                        <div key={i} className="flex-shrink-0 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5">
                          {actor.trim()}
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 bg-gold-500 text-black font-bold rounded-xl uppercase tracking-wider text-sm hover:bg-gold-400 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>

                <div className="mt-8 z-10 w-full">
                  <button
                    type="submit"
                    form="movieForm"
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <span>💾</span> {editingMovie ? 'Update Movie Database' : 'Save To Database'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete Movie"
        isDangerous={true}
      />
    </div>
  );
};

export default AdminMovies;
