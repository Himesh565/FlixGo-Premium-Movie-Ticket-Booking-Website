import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Feedback = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        rating: 5,
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/feedback');
            // Assuming backend returns { success: true, feedback: [...] }
            if (response.data.success) {
                setFeedbacks(response.data.feedback || []);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                rating: formData.rating,
                feedback: formData.message // Backend expects 'feedback', frontend state has 'message'
            };

            const response = await axios.post('http://localhost:5000/api/feedback', dataToSend);

            if (response.data.success) {
                setSubmitted(true);
                toast.success('Thank you for your feedback!');
                fetchFeedbacks(); // Refresh list

                // Reset form after delay
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        rating: 5,
                        message: ''
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(error.response?.data?.error || 'Error submitting feedback. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const setRating = (value) => {
        setFormData(prev => ({
            ...prev,
            rating: value
        }));
    };

    return (
        <div className="min-h-screen bg-black text-white pt-36 px-4 md:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl font-bold font-luxury text-gold-500 mb-4">
                        We Value Your Feedback
                    </h1>
                    <p className="text-gray-400">
                        Tell us about your experience with FlixGo. Your feedback helps us improve.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden mb-20 shadow-2xl">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6">
                                ✓
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-gray-400">Your feedback has been submitted successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-gold-500' : 'text-gray-600'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all resize-none"
                                    placeholder="Share your thoughts with us..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gold-500 text-black font-bold text-lg rounded-xl hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/20"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>

                {/* User Reviews Section */}
                <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold font-luxury text-white mb-8 text-center">
                        User <span className="text-gold-500">Reviews</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {feedbacks.map((item) => (
                            <div key={item._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center font-bold">
                                            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                            <span className="text-gray-500 text-xs">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex text-gold-500 text-sm">
                                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm italic leading-relaxed">"{item.feedback}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
