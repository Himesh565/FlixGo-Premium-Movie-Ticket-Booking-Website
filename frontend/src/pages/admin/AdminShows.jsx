import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminShows = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theatersLoading, setTheatersLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    date: '',
    time: '',
    screen: '',
    totalSeats: '100',
    price: ''
  });

  /* New Delete Confirmation State */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchTheaters();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shows');
      setShows(response.data.data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/theaters');
      setTheaters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      setTheaters([]);
    } finally {
      setTheatersLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const showData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price),
        date: new Date(formData.date)
      };

      if (editingShow) {
        await axios.put(`http://localhost:5000/api/shows/${editingShow._id}`, showData);
        toast.success('Show updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/shows', showData);
        toast.success('Show scheduled successfully!');
      }

      setShowModal(false);
      setEditingShow(null);
      resetForm();
      fetchShows();
    } catch (error) {
      console.error('Error saving show:', error);
      toast.error('Error saving show. Please try again.');
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movieId: show.movieId?._id || '',
      theaterId: show.theaterId?._id || '',
      date: new Date(show.date).toISOString().split('T')[0],
      time: show.time,
      screen: show.screen,
      totalSeats: show.totalSeats.toString(),
      price: show.price.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (showId) => {
    setItemToDelete(showId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/shows/${itemToDelete}`);
      toast.success('Show deleted successfully');
      fetchShows();
    } catch (error) {
      console.error('Error deleting show:', error);
      toast.error('Error deleting show. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      movieId: '',
      theaterId: '',
      date: '',
      time: '',
      screen: '',
      totalSeats: '100',
      price: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: value
    };

    // Auto-update total seats when screen is selected
    if (name === 'screen' && formData.theaterId && value) {
      const selectedTheater = theaters.find(t => t._id === formData.theaterId);
      const selectedScreen = selectedTheater?.screens?.find(s => s.screenNumber === value);
      if (selectedScreen && selectedScreen.totalSeats) {
        updatedFormData.totalSeats = selectedScreen.totalSeats.toString();
      }
    }

    // Clear screen when theater changes
    if (name === 'theaterId') {
      updatedFormData.screen = '';
      updatedFormData.totalSeats = '100';
    }

    setFormData(updatedFormData);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper to get selected movie/theater details for Preview
  const getSelectedMovie = () => movies.find(m => m._id === formData.movieId);
  const getSelectedTheater = () => theaters.find(t => t._id === formData.theaterId);

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
          <Link to="/admin/movies" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>🎬</span> Manage Movies
          </Link>
          <Link to="/admin/shows" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
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
          <h1 className="text-xl font-bold font-luxury text-white">Manage Shows</h1>
          <button className="text-gray-400">☰</button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-luxury text-white mb-2">Show Schedule</h1>
              <p className="text-gray-400">Schedule movie screenings and manage availability.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingShow(null);
                setShowModal(true);
              }}
              disabled={movies.length === 0 || theaters.length === 0}
              className="px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-colors flex items-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="group-hover:rotate-180 transition-transform">➕</span> Schedule Show
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
                      <th className="p-4">Movie</th>
                      <th className="p-4">Theater</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Screen</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Occupancy</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {shows.map(show => (
                      <tr key={show._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white mb-1">{show.movieId?.title || 'Unknown Movie'}</div>
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400 border border-white/5">
                            {show.movieId?.language || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-300 font-medium">{show.theaterId?.name || 'Unknown Theater'}</div>
                          <div className="text-xs text-gray-500">{show.theaterId?.location?.city || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{formatDate(show.date)}</div>
                          <div className="text-xs text-gold-500/80 font-mono mt-1">{show.time}</div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 text-sm">{show.screen}</span>
                        </td>
                        <td className="p-4 font-bold text-gold-500">₹{show.price}</td>
                        <td className="p-4">
                          {/* Occupancy Bar */}
                          <div className="w-24">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span>{show.availableSeats?.filter(s => !s.isBooked).length || 0} left</span>
                              <span>{show.totalSeats}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-500 to-yellow-300 rounded-full"
                                style={{ width: `${((show.totalSeats - (show.availableSeats?.filter(s => !s.isBooked).length || 0)) / show.totalSeats) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(show)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(show._id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {shows.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4">🎪</div>
                            <p>No shows scheduled yet.</p>
                            <button onClick={() => setShowModal(true)} className="mt-4 text-gold-500 hover:underline">Create first show</button>
                          </div>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 z-10 shrink-0">
              <div>
                <h2 className="text-2xl font-bold font-luxury text-white">
                  {editingShow ? 'Update Schedule' : 'Schedule New Show'}
                </h2>
                <p className="text-gray-400 text-sm">Create a screening listing for user bookings.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">&times;</button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Form (60%) */}
              <div className="lg:col-span-7 overflow-y-auto p-8 border-r border-white/5 bg-gradient-to-br from-gray-900 to-black/50">
                <form id="showForm" onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider text-xs">Movie Selection</label>
                    <select
                      name="movieId"
                      value={formData.movieId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none appearance-none"
                      required
                    >
                      <option value="">Select a Movie</option>
                      {movies.map(m => (
                        <option key={m._id} value={m._id}>{m.title} ({m.language})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider text-xs">Venue & Screen</label>
                    <div className="grid grid-cols-1 gap-4">
                      <select
                        name="theaterId"
                        value={formData.theaterId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none appearance-none"
                        required
                      >
                        <option value="">Select Theater</option>
                        {theaters.map(t => (
                          <option key={t._id} value={t._id}>{t.name}, {t.location.city}</option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-4">
                        <select
                          name="screen"
                          value={formData.screen}
                          onChange={handleInputChange}
                          disabled={!formData.theaterId}
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none appearance-none disabled:opacity-50"
                          required
                        >
                          <option value="">Select Screen</option>
                          {formData.theaterId && theaters.find(t => t._id === formData.theaterId)?.screens?.map(s => (
                            <option key={s.screenNumber} value={s.screenNumber}>{s.screenNumber} ({s.screenType})</option>
                          ))}
                        </select>
                        <div className="relative">
                          <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleInputChange} // Allow manual override if needed, though auto-filled
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none pl-10"
                            required
                          />
                          <span className="absolute left-3 top-3.5 text-gray-500">💺</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider text-xs">Timing & Pricing</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                        required
                      />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none text-lg font-bold text-gold-500"
                        placeholder="0.00"
                        required
                      />
                      <span className="absolute left-4 top-4 text-gray-500">₹</span>
                    </div>
                  </div>

                </form>
              </div>

              {/* Right Column: Ticket Preview (40%) */}
              <div className="lg:col-span-5 bg-black/20 p-8 flex flex-col items-center border-l border-white/10 relative overflow-y-auto">
                <div className="absolute inset-0 bg-gold-500/5 blur-3xl"></div>
                <h3 className="uppercase text-xs font-bold text-gray-500 tracking-widest mb-6 z-10">Listing Preview</h3>

                {/* Preview Ticket Card */}
                <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative z-10">
                  <div className="h-40 bg-gray-800 relative overflow-hidden">
                    {getSelectedMovie()?.poster ? (
                      <img
                        src={getSelectedMovie().poster.startsWith('http') ? getSelectedMovie().poster : `http://localhost:5000${getSelectedMovie().poster}`}
                        className="w-full h-full object-cover opacity-60"
                        alt="Movie"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">No Movie Selected</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white leading-tight font-luxury">{getSelectedMovie()?.title || 'Movie Title'}</h3>
                      <p className="text-sm text-gray-400">{getSelectedMovie()?.genre || 'Genre'}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-900 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Theater</p>
                        <p className="text-white font-medium">{getSelectedTheater()?.name || 'Theater Name'}</p>
                        <p className="text-xs text-gray-400">{getSelectedTheater()?.location?.city || 'City'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Screen</p>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/10">{formData.screen || 'Screen #'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                        <p className="text-gold-400 font-bold text-lg">
                          {formData.time || '--:--'}
                        </p>
                        <p className="text-xs text-gray-400">{formData.date ? new Date(formData.date).toLocaleDateString() : 'DD MMM YYYY'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-bold text-white">₹{formData.price || '0'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gold-500 p-3 text-center">
                    <span className="text-black font-bold text-sm uppercase tracking-widest">Book Ticket</span>
                  </div>
                </div>

                <div className="mt-8 w-full z-10">
                  <button type="submit" form="showForm" className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all">
                    {editingShow ? 'Update Schedule' : 'Confirm & Publish Show'}
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
        title="Cancel Show"
        message="Are you sure you want to cancel this scheduled show? Bookings might be affected."
        confirmText="Cancel Show"
        isDangerous={true}
      />
    </div>
  );
};

export default AdminShows;
