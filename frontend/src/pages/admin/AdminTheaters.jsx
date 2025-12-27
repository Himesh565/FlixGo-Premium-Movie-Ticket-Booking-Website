import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminTheaters = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);

  // Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    screens: [
      {
        screenNumber: 'Screen 1',
        screenType: 'Regular',
        totalSeats: 100
      }
    ],
    amenities: [],
    contact: {
      phone: '',
      email: ''
    },
    operatingHours: {
      openTime: '09:00',
      closeTime: '23:00'
    },
    image: '', // Will hold URL if editing, or be ignored if file is uploaded
    rating: 4.0,
    status: 'active'
  });

  const screenTypes = ['Regular', 'IMAX', '4DX', 'Dolby Atmos', 'Premium'];
  const amenityOptions = ['Parking', 'Food Court', 'Restaurant', 'ATM', 'Wheelchair Access', 'Air Conditioning', 'Security'];
  const statusOptions = ['active', 'inactive', 'maintenance'];

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('http://localhost:5000/api/theaters/admin/all');
      setTheaters(response.data.data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      let config = {};

      if (selectedFile) {
        // Use FormData for file upload
        data = new FormData();
        data.append('name', formData.name);
        data.append('rating', formData.rating);
        data.append('status', formData.status);

        data.append('location', JSON.stringify(formData.location));
        data.append('contact', JSON.stringify(formData.contact));
        data.append('operatingHours', JSON.stringify(formData.operatingHours));
        data.append('amenities', JSON.stringify(formData.amenities));

        const screensData = formData.screens.map(screen => ({
          ...screen,
          totalSeats: parseInt(screen.totalSeats) || 100
        }));
        data.append('screens', JSON.stringify(screensData));
        data.append('image', selectedFile);

        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else {
        // Use JSON for text-only update (more reliable)
        data = {
          name: formData.name,
          rating: parseFloat(formData.rating),
          status: formData.status,
          location: formData.location,
          contact: formData.contact,
          operatingHours: formData.operatingHours,
          amenities: formData.amenities,
          screens: formData.screens.map(screen => ({
            ...screen,
            totalSeats: parseInt(screen.totalSeats) || 100
          })),
          // Keep existing image if not updating
          image: formData.image
        };
        config = { headers: { 'Content-Type': 'application/json' } };
      }

      if (editingTheater) {
        await axios.put(`http://localhost:5000/api/theaters/${editingTheater._id}`, data, config);
        toast.success('Theater updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/theaters', data, config);
        toast.success('Theater added successfully!');
      }

      setShowModal(false);
      setEditingTheater(null);
      resetForm();
      fetchTheaters();
    } catch (error) {
      console.error('Error saving theater:', error);
      toast.error(error.response?.data?.message || 'Error saving theater. Please try again.');
    }
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name,
      location: theater.location,
      screens: theater.screens.length > 0 ? theater.screens : [
        { screenNumber: 'Screen 1', screenType: 'Regular', totalSeats: 100 }
      ],
      amenities: theater.amenities || [],
      contact: theater.contact || { phone: '', email: '' },
      operatingHours: theater.operatingHours || { openTime: '09:00', closeTime: '23:00' },
      image: theater.image || '',
      rating: theater.rating || 4.0,
      status: theater.status || 'active'
    });

    // Set preview to existing image
    if (theater.image) {
      setImagePreview(theater.image.startsWith('http') ? theater.image : `http://localhost:5000${theater.image}`);
    } else {
      setImagePreview('');
    }

    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = (theaterId) => {
    setItemToDelete(theaterId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.delete(`http://localhost:5000/api/theaters/${itemToDelete}`, config);
      toast.success('Theater permanently deleted successfully');
      fetchTheaters();
    } catch (error) {
      console.error('Error deleting theater:', error);
      toast.error(error.response?.data?.message || 'Error deleting theater. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: { address: '', city: '', state: '', pincode: '' },
      screens: [{ screenNumber: 'Screen 1', screenType: 'Regular', totalSeats: 100 }],
      amenities: [],
      contact: { phone: '', email: '' },
      operatingHours: { openTime: '09:00', closeTime: '23:00' },
      image: '',
      rating: 4.0,
      status: 'active'
    });
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleScreenChange = (index, field, value) => {
    const updatedScreens = [...formData.screens];
    updatedScreens[index] = {
      ...updatedScreens[index],
      [field]: field === 'totalSeats' ? parseInt(value) || 100 : value
    };
    setFormData(prev => ({
      ...prev,
      screens: updatedScreens
    }));
  };

  const addScreen = () => {
    setFormData({
      ...formData,
      screens: [
        ...formData.screens,
        { screenNumber: `Screen ${formData.screens.length + 1}`, screenType: 'Regular', totalSeats: 100 }
      ]
    });
  };

  const removeScreen = (index) => {
    if (formData.screens.length > 0) {
      const updatedScreens = formData.screens.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        screens: updatedScreens
      });
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <Link to="/admin/movies" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>🎬</span> Manage Movies
          </Link>
          <Link to="/admin/shows" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <span>🎪</span> Manage Shows
          </Link>
          <Link to="/admin/theaters" className="flex items-center gap-3 px-4 py-3 bg-gold-500/10 text-gold-500 rounded-xl font-semibold border border-gold-500/20">
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
          <h1 className="text-xl font-bold font-luxury text-white">Manage Theaters</h1>
          <button className="text-gray-400">☰</button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-luxury text-white mb-2">Theater Partners</h1>
              <p className="text-gray-400">Manage theater locations, screens, and amenities.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingTheater(null);
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-colors flex items-center gap-2 shadow-lg shadow-gold-500/20 group"
            >
              <span className="group-hover:rotate-90 transition-transform">➕</span> Add New Theater
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {theaters.map(theater => (
                <div key={theater._id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-gold-500/30 transition-all group">
                  <div className="relative h-48 bg-gray-800">
                    <img
                      src={theater.image ? (theater.image.startsWith('http') ? theater.image : `http://localhost:5000${theater.image}`) : 'https://via.placeholder.com/400x200?text=Theater'}
                      alt={theater.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Theater'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 shadow-black drop-shadow-md">{theater.name}</h3>
                      <p className="text-gray-300 text-sm flex items-center gap-1">
                        📍 {theater.location.city}, {theater.location.state}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/10">{theater.screens?.length || 0} Screens</span>
                        <span className="px-2 py-1 bg-white/5 rounded border border-white/10">⭐ {theater.rating}</span>
                        <span className={`px-2 py-1 rounded border ${theater.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                          {theater.status === 'active' ? '● Active' : `○ ${theater.status?.charAt(0).toUpperCase() + theater.status?.slice(1)}`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(theater)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">✏️</button>
                        <button onClick={() => handleDelete(theater._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">🗑️</button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                      {theater.location.address}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {theater.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="text-[10px] uppercase font-bold text-gold-500/80 bg-gold-500/10 px-2 py-1 rounded">{am}</span>
                      ))}
                      {theater.amenities.length > 3 && <span className="text-[10px] text-gray-600 self-center">+{theater.amenities.length - 3}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {theaters.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No theaters added yet.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 z-10 shrink-0">
              <div>
                <h2 className="text-2xl font-bold font-luxury text-white">
                  {editingTheater ? 'Edit Theater Details' : 'Onboard New Theater'}
                </h2>
                <p className="text-gray-400 text-sm">Configure theater location, screens, and amenities.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">&times;</button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Basic Details (55%) */}
              <div className="lg:col-span-7 overflow-y-auto p-8 border-r border-white/5 bg-gradient-to-br from-gray-900 to-black/50">
                <form id="theaterForm" onSubmit={handleSubmit} className="space-y-8" autoComplete="off">

                  {/* Section: Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2 flex items-center gap-2">
                      🏢 Theater Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Theater Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" required placeholder="e.g. PVR Cinemas" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Theater Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full border border-white/20 bg-black/40 overflow-hidden flex-shrink-0 relative group">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">📷</div>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-white">Change</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              title="Choose Image"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Upload a round-style theater photo.</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold-500/10 file:text-gold-500 hover:file:bg-gold-500/20"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-400 mb-2">Status</label>
                          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none appearance-none">
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-400 mb-2">Rating</label>
                          <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" placeholder="4.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Location */}
                  <div className="space-y-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2 flex items-center gap-2">
                      📍 Location Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Full Address</label>
                        <textarea name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none resize-none" rows="2" required placeholder="Street, Area, Landmark"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">City</label>
                        <input type="text" name="location.city" value={formData.location.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">State</label>
                        <input type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Pincode</label>
                        <input type="text" name="location.pincode" value={formData.location.pincode} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" required />
                      </div>
                    </div>
                  </div>

                  {/* Section: Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2 flex items-center gap-2">
                      ✨ Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenityOptions.map(amenity => (
                        <label key={amenity} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.amenities.includes(amenity) ? 'bg-gold-500/20 border-gold-500 text-white' : 'bg-black/20 border-white/5 text-gray-400 hover:bg-black/40'}`}>
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="hidden"
                          />
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                            {formData.amenities.includes(amenity) && <span className="w-2 h-2 bg-current rounded-full"></span>}
                          </span>
                          <span className="text-sm font-medium">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Hours */}
                  <div className="space-y-4">
                    <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-4 border-b border-gold-500/20 pb-2 flex items-center gap-2">
                      📞 Contact & Hours
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Phone</label>
                        <input type="text" name="contact.phone" value={formData.contact.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
                        <input type="email" name="contact.email" value={formData.contact.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Opens At</label>
                        <input type="time" name="operatingHours.openTime" value={formData.operatingHours.openTime} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Closes At</label>
                        <input type="time" name="operatingHours.closeTime" value={formData.operatingHours.closeTime} onChange={handleInputChange} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 outline-none" />
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* Right Column: Screen Management (45%) */}
              <div className="lg:col-span-5 bg-black/20 p-8 flex flex-col border-l border-white/10 overflow-y-auto">
                <h3 className="text-gold-500 font-bold uppercase text-xs tracking-widest mb-6 border-b border-gold-500/20 pb-2 flex items-center justify-between">
                  <span>🎬 Screen Configuration</span>
                  <button type="button" onClick={addScreen} className="text-xs bg-gold-500 text-black px-2 py-1 rounded font-bold hover:bg-gold-400 transition-colors">+ Add Screen</button>
                </h3>

                <div className="space-y-4 flex-1">
                  {formData.screens.map((screen, index) => (
                    <div key={index} className="bg-gray-800/50 border border-white/10 rounded-xl p-4 relative group hover:border-gold-500/30 transition-colors">
                      <button
                        type="button"
                        onClick={() => removeScreen(index)}
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                        title="Remove Screen"
                      >
                        ❌
                      </button>

                      <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-12 md:col-span-5">
                          <label className="text-xs text-gray-500 mb-1 block">Screen Name</label>
                          <input
                            type="text"
                            value={screen.screenNumber}
                            onChange={(e) => handleScreenChange(index, 'screenNumber', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 outline-none"
                            placeholder="Screen 1"
                          />
                        </div>
                        <div className="col-span-6 md:col-span-4">
                          <label className="text-xs text-gray-500 mb-1 block">Type</label>
                          <select
                            value={screen.screenType}
                            onChange={(e) => handleScreenChange(index, 'screenType', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 outline-none"
                          >
                            {screenTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <label className="text-xs text-gray-500 mb-1 block">Seats</label>
                          <input
                            type="number"
                            value={screen.totalSeats}
                            onChange={(e) => handleScreenChange(index, 'totalSeats', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 outline-none"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.screens.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                      <p className="text-gray-500 text-sm mb-2">No screens added yet.</p>
                      <button type="button" onClick={addScreen} className="text-gold-500 text-sm hover:underline">Add First Screen</button>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/10">
                  <button type="submit" form="theaterForm" className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all">
                    {editingTheater ? 'Update Theater Details' : 'Onboard Theater'}
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
        title="Permanent Delete"
        message="Are you sure you want to permanently delete this theater? This action cannot be undone. To hide it instead, use the Edit button to change status to Inactive."
        confirmText="Permanently Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default AdminTheaters;
