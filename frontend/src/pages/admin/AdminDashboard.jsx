import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Ensure we have a valid token
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('http://localhost:5000/api/movies/admin/dashboard-stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired or unauthorized, redirect to home page
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/movies" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
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
        {/* Header (Mobile Only / Breadcrumb) */}
        <header className="md:hidden bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold font-luxury text-white">Dashboard</h1>
          <button className="text-gray-400">☰</button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-luxury text-white mb-2">Platform Overview</h1>
            <p className="text-gray-400">Welcome back, here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Movies</p>
                  <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-blue-400">{stats.totalMovies}</h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                  🎬
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Users</p>
                  <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-green-400">{stats.totalUsers}</h3>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
                  👥
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-purple-400">{stats.totalBookings}</h3>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                  🎟️
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-gold-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-gold-400">₹{stats.totalRevenue?.toLocaleString() || 0}</h3>
                </div>
                <div className="p-3 bg-gold-500/10 rounded-xl text-gold-500 group-hover:scale-110 transition-transform">
                  💰
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              </div>
              <div className="p-6 grid gap-4">
                <Link to="/admin/movies" className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                      🎬
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Add New Movie</h4>
                      <p className="text-xs text-gray-500">Update database with latest films</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link to="/admin/shows" className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                      🎪
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Schedule Shows</h4>
                      <p className="text-xs text-gray-500">Manage screenings and timings</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link to="/admin/theaters" className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                      🏢
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Manage Theaters</h4>
                      <p className="text-xs text-gray-500">Add or edit cinema halls</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-white">System Status</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-gray-300">Server Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-gray-300">Database Connection</span>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                  <span className="text-gray-300">Last Synced</span>
                  <span className="text-gray-500 font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
