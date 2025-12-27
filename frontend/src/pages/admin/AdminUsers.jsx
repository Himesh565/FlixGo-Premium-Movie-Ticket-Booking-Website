import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const AdminUsers = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.get('http://localhost:5000/api/auth/users');
            if (response.data) {
                setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
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

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
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
                    <h1 className="text-xl font-bold font-luxury text-white">User Management</h1>
                    <button className="text-gray-400">☰</button>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold font-luxury text-white mb-2">User Management</h1>
                        <p className="text-gray-400">View and manage registered users.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gold-600/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">Total Users</p>
                            <p className="text-3xl font-bold text-white">{users.length}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">Active Users</p>
                            <p className="text-3xl font-bold text-green-400">{users.length}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-2">New This Month</p>
                            <p className="text-3xl font-bold text-gold-400">
                                {users.filter(u => {
                                    const userDate = new Date(u.createdAt);
                                    const now = new Date();
                                    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white/5 backdrop-blur-lg border border-gold-600/30 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gold-500/20 border-b border-gold-600/30">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">Registered</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user._id || index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-bold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white font-medium">{user.name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{user.email || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-300">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-sm">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                {searchTerm ? 'No users found matching your search' : 'No users registered yet'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminUsers;
