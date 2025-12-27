import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const AdminFeedback = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, 5star, 4star, etc.

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.get('http://localhost:5000/api/feedback');
            if (response.data) {
                setFeedback(Array.isArray(response.data) ? response.data : response.data.feedback || []);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
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

    const getFilteredFeedback = () => {
        if (filter === 'all') return feedback;
        const rating = parseInt(filter);
        return feedback.filter(f => f.rating === rating);
    };

    const getAverageRating = () => {
        if (feedback.length === 0) return 0;
        const sum = feedback.reduce((acc, f) => acc + (f.rating || 0), 0);
        return (sum / feedback.length).toFixed(1);
    };

    const filteredFeedback = getFilteredFeedback();

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
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
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
                    <Link to="/admin/feedback" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
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
                    <h1 className="text-xl font-bold font-luxury text-white">User Feedback</h1>
                    <button className="text-gray-400">☰</button>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold font-luxury text-white mb-2">User Feedback</h1>
                        <p className="text-gray-400">View and analyze customer feedback and reviews.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">Total Feedback</p>
                            <p className="text-3xl font-bold text-white">{feedback.length}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">Average Rating</p>
                            <p className="text-3xl font-bold text-gold-400">{getAverageRating()} ⭐</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">5-Star Reviews</p>
                            <p className="text-3xl font-bold text-green-400">{feedback.filter(f => f.rating === 5).length}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">1-Star Reviews</p>
                            <p className="text-3xl font-bold text-red-400">{feedback.filter(f => f.rating === 1).length}</p>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-6 flex gap-3 flex-wrap">
                        {['all', 5, 4, 3, 2, 1].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setFilter(rating.toString())}
                                className={`px-4 py-2 rounded-lg transition-all ${filter === rating.toString()
                                    ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-gold-500/50'
                                    } border`}
                            >
                                {rating === 'all' ? 'All' : `${rating} ⭐`}
                            </button>
                        ))}
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-4">
                        {filteredFeedback.length > 0 ? (
                            filteredFeedback.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6 hover:border-gold-500/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold text-lg">
                                                {item.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{item.name || 'Anonymous'}</h3>
                                                <p className="text-gray-400 text-sm">{item.email || 'No email provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={star <= (item.rating || 0) ? 'text-gold-400' : 'text-gray-600'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{item.feedback || 'No feedback provided'}</p>
                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-gray-500 text-sm">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Date not available'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-12 text-center">
                                <p className="text-gray-400 text-lg">
                                    {filter === 'all' ? 'No feedback submitted yet' : `No ${filter}-star reviews found`}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminFeedback;
