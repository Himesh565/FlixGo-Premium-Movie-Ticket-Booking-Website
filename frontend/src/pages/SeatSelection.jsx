import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shows/${showId}`);
      setShow(response.data.data);
    } catch (error) {
      setError('Show not found');
      console.error('Error fetching show:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (!show?.availableSeats) return;
    const seat = show.availableSeats.find(s => s.seatNumber === seatNumber);
    if (!seat || seat.isBooked) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setBookingLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const bookingResponse = await axios.post('http://localhost:5000/api/bookings', {
        movieId: show.movieId._id,
        showId: show._id,
        seats: selectedSeats
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      navigate('/confirmation', {
        state: {
          booking: bookingResponse.data.data,
          totalAmount: selectedSeats.length * show.price
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed');
      // if (error.response?.status === 400) fetchShowDetails(); // Removed to prevent potential loops or crashes
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const getSeatStatus = (seatNumber) => {
    if (!show?.availableSeats) return 'none';
    const seat = show.availableSeats.find(s => s.seatNumber === seatNumber);
    if (!seat) return 'none';

    if (seat.isBooked) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const renderSeatLayout = () => {
    if (!show || !show.availableSeats) return null;

    const rows = 10;
    const seatsPerRow = 10;
    const seatLayout = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      const rowLabel = String.fromCharCode(65 + row);

      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${rowLabel}${seat}`;
        const seatExists = show.availableSeats.find(s => s.seatNumber === seatNumber);
        const status = seatExists ? getSeatStatus(seatNumber) : 'none';

        // Add gap for aisle
        if (seat === 6) {
          rowSeats.push(<div key={`gap-${row}-${seat}`} className="w-12"></div>);
        }

        if (status !== 'none') {
          rowSeats.push(
            <div
              key={seatNumber}
              onClick={() => status !== 'booked' && handleSeatClick(seatNumber)}
              className="relative group m-1"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${status === 'booked'
                  ? 'fill-gray-800 cursor-not-allowed opacity-50'
                  : status === 'selected'
                    ? 'fill-gold-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] transform scale-110'
                    : 'fill-gray-700/50 hover:fill-gold-400/50 cursor-pointer hover:scale-110'
                  }`}
              >
                {/* Chair Path */}
                <path d="M7 13v-4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4h2v7h-2v2h-2v-2H9v2H7v-2H5v-7h2z M7 13h10v-3H7v3z" />
                {/* Armrests Detail */}
                <path d="M19 13v4h2v-4h-2z M3 13v4h2v-4H3z" className={status === 'selected' ? 'fill-gold-600' : 'fill-white/10'} />
              </svg>

              {/* Tooltip for seat number */}
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gold-500/30 text-gold-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 ${status === 'booked' ? 'hidden' : ''}`}>
                {seatNumber} - ₹{show.price}
              </div>
            </div>
          );
        } else {
          rowSeats.push(
            <div key={seatNumber} className="w-8 h-8 md:w-10 md:h-10 m-1 invisible"></div>
          );
        }
      }

      seatLayout.push(
        <div key={row} className="flex items-center justify-center mb-1">
          <div className="w-8 text-gray-500 text-xs font-bold font-luxury">{rowLabel}</div>
          <div className="flex px-2 md:px-6">{rowSeats}</div>
          <div className="w-8 text-gray-500 text-xs font-bold font-luxury text-right">{rowLabel}</div>
        </div>
      );
    }

    return seatLayout;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Show not found'}</h2>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gold-500 text-black rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-32 px-4 text-white relative">
      <div className="container mx-auto max-w-5xl">
        {/* Compact Header Info */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black rounded-2xl p-6 border border-white/5 mb-12 animate-fade-in-up flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <div>
            <h2 className="text-3xl font-bold font-luxury text-white mb-2">{show?.movieId?.title || 'Unknown Movie'}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><span className="text-gold-500">📍</span> {show?.theaterId?.name}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>{formatDate(show?.date)} | {show?.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Screen</div>
              <div className="text-lg font-bold text-white">{show?.screen}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Ticket</div>
              <div className="text-lg font-bold text-gold-500">₹{show?.price}</div>
            </div>
          </div>
        </div>

        {/* Screen Visual */}
        <div className="perspective-1000 mb-16 animate-fade-in-up animation-delay-200 relative">
          {/* Projector Light Effect */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80%] h-32 bg-gradient-to-b from-gold-500/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

          <div className="w-3/4 mx-auto h-4 bg-white/80 transform rotate-x-12 rounded-[50%] shadow-[0_0_20px_rgba(255,255,255,0.6)] box-shadow-glow"></div>
          <div className="w-2/3 mx-auto h-20 bg-gradient-to-b from-white/10 to-transparent transform -skew-x-12 opacity-30 blur-xl"></div>

          <div className="text-center text-gray-600 text-[10px] font-luxury tracking-[0.8em] uppercase mt-4">All Eyes This Way</div>
        </div>

        {/* Seats */}
        <div className="overflow-x-auto pb-12 mb-8 animate-fade-in-up animation-delay-200 custom-scrollbar flex justify-center">
          <div className="bg-gray-900/30 p-8 rounded-[3rem] border border-white/5 backdrop-blur-sm">
            {renderSeatLayout()}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-8 mb-8 text-sm text-gray-400 animate-fade-in-up animation-delay-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-gray-700/50"><path d="M7 13v-4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4h2v7h-2v2h-2v-2H9v2H7v-2H5v-7h2z M7 13h10v-3H7v3z" /></svg>
            </div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-gold-500"><path d="M7 13v-4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4h2v7h-2v2h-2v-2H9v2H7v-2H5v-7h2z M7 13h10v-3H7v3z" /></svg>
            </div>
            <span className="text-gold-500 font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-gray-800"><path d="M7 13v-4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v4h2v7h-2v2h-2v-2H9v2H7v-2H5v-7h2z M7 13h10v-3H7v3z" /></svg>
            </div>
            <span>Booked</span>
          </div>
        </div>

        {/* Floating Checkout Bar */}
        <div className="fixed bottom-6 left-0 right-0 mx-auto w-[90%] max-w-4xl bg-gray-900/95 backdrop-blur-2xl border border-gold-500/20 rounded-3xl p-4 shadow-2xl z-50 animate-slide-up flex justify-between items-center px-8">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Amount</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">₹{selectedSeats.length * (show?.price || 0)}</span>
              <span className="text-sm text-gray-500 font-medium">for {selectedSeats.length} seats</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Seats</span>
              <span className="text-gold-400 font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {bookingLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Booking...
                </span>
              ) : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-12 { transform: rotateX(-30deg) scale(0.9); }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.3); border-radius: 10px; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .box-shadow-glow { box-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(234,179,8,0.3); }
      `}</style>
    </div>
  );
};

export default SeatSelection;
