import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Custom Modal & Notification States
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null });
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const activeBookings = (response.data.data || []).filter(b => b.paymentStatus !== 'refunded');
      setBookings(activeBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const result = await updateProfile(profileData.name, profileData.email);
    showNotification(
      result.success ? 'Profile updated successfully!' : (result.message || 'Update failed'),
      result.success ? 'success' : 'error'
    );
    setProfileLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 1. Trigger Modal
  const initiateCancellation = (bookingId) => {
    setCancelModal({ show: true, bookingId });
  };

  // 2. Confirm Action
  const confirmCancellation = async () => {
    if (!cancelModal.bookingId) return;

    setIsCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${cancelModal.bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setBookings(prevBookings => prevBookings.filter(b => b._id !== cancelModal.bookingId));
      showNotification('Booking cancelled successfully. Refund initiated.', 'success');
      setCancelModal({ show: false, bookingId: null });

    } catch (error) {
      console.error('Error cancelling booking:', error);
      showNotification('Failed to cancel booking. Please try again.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString, time) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    return time ? `${date} • ${time}` : date;
  };

  if (loading && activeTab === 'bookings') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gold-500/10 to-transparent pointer-events-none"></div>

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-left">
          <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
            <span className="text-xl">{notification.type === 'success' ? '✓' : '✕'}</span>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Custom Cancellation Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCancelModal({ show: false, bookingId: null })} ></div>
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative animate-scale-up">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-red-500">
              ⚠️
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Cancel Booking?</h3>
            <p className="text-gray-400 text-center mb-8">
              Are you sure you want to cancel this ticket? This action cannot be undone and your seats will be released.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCancelModal({ show: false, bookingId: null })}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-bold"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmCancellation}
                disabled={isCancelling}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-bold shadow-lg shadow-red-500/30 flex justify-center items-center gap-2"
              >
                {isCancelling ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 border border-gold-500/30 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col items-center gap-6 relative z-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] border-2 border-white/20">
              <span className="text-4xl font-bold text-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>

            <div className="flex-1 w-full">
              <h1 className="text-3xl font-bold text-white mb-2 font-luxury tracking-wide">{user?.name}</h1>
              <p className="text-gray-400 font-medium mb-6">{user?.email}</p>

              <div className="flex gap-6 justify-center text-sm">
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 min-w-[120px]">
                  <span className="block text-gray-400 text-xs uppercase mb-1">Total Bookings</span>
                  <span className="text-white font-bold text-lg">{bookings.length}</span>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 min-w-[120px]">
                  <span className="block text-gray-400 text-xs uppercase mb-1">Member Since</span>
                  <span className="text-white font-bold text-lg">{new Date(user?.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 w-full flex justify-center">
              <button onClick={handleLogout} className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-xl transition-all font-medium text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'bookings' && (
            <div className="animate-fade-in-up">
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">🎫</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No active tickets</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">You don't have any active bookings.</p>
                  <Link to="/" className="px-8 py-3 bg-gold-500 text-black rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20">
                    Book a Movie
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 group hover:border-gold-500/50 transition-all hover:-translate-y-1 relative">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/20 rounded-full text-xs font-bold backdrop-blur-md">Confirmed</span>
                      </div>

                      <div className="relative h-48">
                        <img
                          src={booking.movieId?.poster ? (booking.movieId.poster.startsWith('http') ? booking.movieId.poster : `http://localhost:5000${booking.movieId.poster}`) : 'https://via.placeholder.com/300x200'}
                          alt={booking.movieId?.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white truncate">{booking.movieId?.title}</h3>
                          <p className="text-gold-500 text-xs font-bold">{booking.showId?.theaterId?.name}</p>
                        </div>
                      </div>

                      <div className="p-6 relative">
                        {/* Ticket Notch */}
                        <div className="absolute -top-3 left-0 w-3 h-6 bg-black rounded-r-full"></div>
                        <div className="absolute -top-3 right-0 w-3 h-6 bg-black rounded-l-full"></div>
                        <div className="absolute -top-[1px] left-3 right-3 border-t-2 border-dashed border-gray-700"></div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-400 flex items-center gap-2">
                              <span>📅</span> {formatDate(booking.showId?.date, booking.showId?.time)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-400 flex items-center gap-2">
                              <span>💺</span> Seats: <span className="text-white">{booking.seats?.join(', ')}</span>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-white/5 flex gap-3">
                            <button
                              onClick={() => initiateCancellation(booking._id)}
                              className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-medium border border-red-500/20"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => navigate('/confirmation', { state: { booking } })}
                              className="flex-1 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-medium border border-white/10"
                            >
                              View Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              <div className="bg-gray-900 rounded-3xl p-8 border border-white/10 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Edit Profile Details</h2>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full h-14 mt-8 bg-gradient-to-r from-gold-500 to-yellow-600 rounded-xl text-black font-bold text-lg hover:shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02] transition-all disabled:opacity-70"
                  >
                    {profileLoading ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-left {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Profile;
