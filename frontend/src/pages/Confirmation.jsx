import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'react-qr-code';

const Confirmation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const ticketRef = useRef(null);

  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate('/');
    } else if (booking.paymentStatus === 'completed') {
      setPaymentCompleted(true);
    }
  }, [booking, navigate]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    console.log("Starting payment process...");
    const res = await loadRazorpay();

    if (!res) {
      console.error("Razorpay SDK failed to load");
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setPaymentProcessing(true);

    try {
      const token = localStorage.getItem('token');
      console.log("Fetching Razorpay Key from backend...", 'http://localhost:5000/api/payment/key');

      // 1. Get Razorpay Key dynamically from backend
      const keyResponse = await axios.get('http://localhost:5000/api/payment/key', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("Key Fetch Response:", keyResponse.data);

      const key = keyResponse.data.key;
      // Alert specifically if key is missing to guard against env issues
      if (!key) {
        throw new Error("Razorpay Key ID is undefined. Server might need a restart.");
      }

      console.log("Creating Order for amount:", booking.totalAmount);
      // 2. Create Order
      const orderResponse = await axios.post('http://localhost:5000/api/payment/orders', {
        amount: booking.totalAmount,
        booking_id: booking._id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("Order Creation Response:", orderResponse.data);

      const { amount, id: order_id, currency } = orderResponse.data.order;

      const options = {
        key: key,
        amount: amount.toString(),
        currency: currency,
        name: "FlixGo Cinema",
        description: `Booking for ${booking.movieId.title}`,
        image: "https://via.placeholder.com/150",
        order_id: order_id,
        handler: async function (response) {
          console.log("Payment Success Callback:", response);
          // 3. Verify Payment
          try {
            await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: booking._id
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log("Payment Verification Success");
            setPaymentCompleted(true);
            setPaymentProcessing(false);
            triggerConfetti();
          } catch (error) {
            console.error('Payment Verification Failed:', error);
            alert(`Payment verification failed: ${error.response?.data?.message || error.message}`);
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: "9999999999"
        },
        notes: {
          booking_id: booking._id
        },
        theme: {
          color: "#EAB308"
        }
      };

      console.log("Opening Razorpay Options:", options);
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.error("Payment Failed:", response.error);
        alert(`Payment Failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      rzp1.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      // Show explicit error to user
      alert(`Debug Error: ${error.response?.data?.message || error.message || "Unknown Error"}`);
      setPaymentProcessing(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: '#000000', // Ensure dark background
          scale: 2,
          useCORS: true // Handle cross-origin images if any
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`FlixGo-Ticket-${booking.bookingId}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate ticket PDF. Please try again.");
      }
    }
  };

  const handleAddToCalendar = () => {
    if (!booking || !booking.showId || !booking.movieId) {
      console.error('Booking data incomplete:', booking);
      alert('Unable to add to calendar. Booking data is incomplete.');
      return;
    }

    try {
      const showDate = new Date(booking.showId.date);
      const [hours, minutes] = booking.showId.time.split(':');
      showDate.setHours(parseInt(hours), parseInt(minutes));

      const startTime = showDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endTime = new Date(showDate.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

      const title = encodeURIComponent(`Movie: ${booking.movieId.title}`);
      const details = encodeURIComponent(`Seats: ${booking.seats.join(', ')}\nBooking ID: ${booking.bookingId}`);
      const theaterName = booking.showId.theaterId?.name || 'Theater';
      const location = encodeURIComponent(`${theaterName}, ${booking.showId.screen}`);

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

      console.log('Opening calendar URL:', url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating calendar event:', error);
      alert('Failed to create calendar event. Please try again.');
    }
  };

  const handleShareWhatsApp = () => {
    if (!booking || !booking.movieId || !booking.showId) {
      console.error('Booking data incomplete:', booking);
      alert('Unable to share. Booking data is incomplete.');
      return;
    }

    try {
      const theaterName = booking.showId.theaterId?.name || 'Theater';
      const text = encodeURIComponent(
        `*MOVIE TICKET BOOKED!*\n\n` +
        `Movie: *${booking.movieId.title}*\n` +
        `Theater: ${theaterName}\n` +
        `Screen: ${booking.showId.screen}\n\n` +
        `Date: *${formatDate(booking.showId.date)}*\n` +
        `Time: *${booking.showId.time}*\n` +
        `Seats: *${booking.seats.join(', ')}*\n` +
        `Total Paid: *Rs. ${booking.totalAmount}*\n` +
        `Booking ID: *${booking.bookingId}*\n\n` +
        `Book your tickets now on *FlixGo*!\n` +
        `Visit: http://localhost:3000`
      );

      const url = `https://wa.me/?text=${text}`;
      console.log('Opening WhatsApp URL:', url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
      alert('Failed to share on WhatsApp. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!booking) return null;

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full relative">

          {/* Ticket Visual to be Downloaded */}
          <div ref={ticketRef} className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gold-500/30 shadow-2xl overflow-hidden relative mb-8">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

            <div className="p-8 text-center border-b-2 border-dashed border-gray-700 relative">
              <div className="absolute -left-4 bottom-[-17px] w-8 h-8 bg-black rounded-full border-r border-gold-500/30"></div>
              <div className="absolute -right-4 bottom-[-17px] w-8 h-8 bg-black rounded-full border-l border-gold-500/30"></div>

              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/50">
                <span className="text-4xl text-green-500">✓</span>
              </div>
              <h2 className="text-4xl font-bold font-luxury text-gold-500 mb-2 tracking-wide">Booking Confirmed!</h2>
              <p className="text-gray-400 font-light">Your ticket has been sent to your email.</p>
            </div>

            <div className="p-8 bg-black/40">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <img
                    src={booking.movieId.poster ? (booking.movieId.poster.startsWith('http') ? booking.movieId.poster : `http://localhost:5000${booking.movieId.poster}`) : 'https://via.placeholder.com/200x300'}
                    alt={booking.movieId.title}
                    crossOrigin="anonymous"
                    className="w-full rounded-lg shadow-lg border border-gold-500/20"
                  />
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{booking.movieId.title}</h3>
                    <p className="text-gold-500 text-sm font-medium">{booking.showId.theaterId?.name} • {booking.showId.screen}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Date</p>
                      <p className="text-white font-medium">{formatDate(booking.showId.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Time</p>
                      <p className="text-white font-medium">{booking.showId.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Seats ({booking.seats.length})</p>
                      <p className="text-gold-400 font-bold text-lg tracking-widest">{booking.seats.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Booking ID</p>
                      <p className="text-white font-mono tracking-wider">{booking.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="text-white font-bold text-lg">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Strip */}
            <div className="bg-white/5 p-6 flex flex-col justify-center items-center border-t border-white/10 gap-3">
              <div className="bg-white p-2 rounded-lg">
                <QRCode
                  value="https://github.com/Himesh565"
                  size={96}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-[10px] text-gray-400 whitespace-nowrap tracking-[0.2em] font-medium">SCAN FOR ENTER</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button onClick={handleDownloadTicket} className="relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-gold-500/50 transition-all group hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform relative z-10">📄</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider relative z-10 group-hover:text-gold-400 transition-colors">Download PDF</span>
            </button>

            <button onClick={handleAddToCalendar} className="relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-gold-500/50 transition-all group hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform relative z-10">📅</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider relative z-10 group-hover:text-gold-400 transition-colors">Calendar</span>
            </button>

            <button onClick={handleShareWhatsApp} className="relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 hover:border-gold-500/50 transition-all group hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform relative z-10">💬</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider relative z-10 group-hover:text-gold-400 transition-colors">Share</span>
            </button>

            <Link to="/" className="flex flex-col items-center justify-center p-4 bg-gold-500 rounded-2xl text-black hover:bg-gold-400 hover:scale-105 transition-all shadow-lg shadow-gold-500/20">
              <span className="text-2xl mb-2 font-bold">🏠</span>
              <span className="text-xs font-bold uppercase tracking-wider">Home</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"></div>

      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 relative z-10">

        {/* LEFT SIDE: TICKET SUMMARY */}
        <div className="w-full md:w-2/3">
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
            {/* Ticket Notch Effect */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-black rounded-l-full border-l border-white/10 z-20"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-black rounded-r-full border-r border-white/10 z-20"></div>

            {/* Dashed Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-700/50 z-10"></div>

            <div className="p-8 pb-12">
              <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest text-xs mb-6">Booking Summary</h3>

              <div className="flex gap-6">
                <img
                  src={booking.movieId.poster ? (booking.movieId.poster.startsWith('http') ? booking.movieId.poster : `http://localhost:5000${booking.movieId.poster}`) : 'https://via.placeholder.com/200x300'}
                  alt={booking.movieId.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-lg shadow-black/50"
                />
                <div className="flex-1 space-y-2">
                  <h2 className="text-3xl font-bold text-white font-luxury">{booking.movieId.title}</h2>
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs font-bold px-2 py-1 bg-white/10 text-white rounded">{booking.movieId.language}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-white/10 text-white rounded">{booking.movieId.genre}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p><span className="text-gold-500">Theater:</span> {booking.showId.theaterId?.name}</p>
                    <p><span className="text-gold-500">Screen:</span> {booking.showId.screen}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-8 pt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="text-lg font-bold text-white">{formatDate(booking.showId.date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Time</p>
                <p className="text-lg font-bold text-white">{booking.showId.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-lg font-bold text-gold-400">₹{booking.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Seat Bubbles */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {booking.seats.map(seat => (
              <span key={seat} className="px-4 py-2 bg-gray-800 rounded-full border border-white/10 text-white font-bold text-sm shadow-lg">
                {seat}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-3xl p-6 border border-white/5 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
                Payment Method
              </h3>

              <label className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${paymentProcessing ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gray-800/50' : 'border-gold-500/50 bg-gradient-to-r from-gray-800 to-gray-900 hover:border-gold-500 shadow-lg shadow-gold-500/5'
                }`}>
                <input type="radio" checked readOnly className="w-5 h-5 text-gold-500 bg-transparent border-gray-600 focus:ring-gold-500 focus:ring-offset-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white group-hover:text-gold-400 transition-colors">Razorpay</span>
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" className="h-6 w-6 opacity-80" alt="rzp" />
                  </div>
                  <p className="text-xs text-gray-400">UPI, Cards, Wallets, Netbanking</p>
                </div>
              </label>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₹{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Convenience Fee</span>
                <span className="text-white">₹0</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-2">
                <span className="text-white font-bold">Total Payable</span>
                <span className="text-2xl font-bold text-gold-500">₹{booking.totalAmount}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full py-4 bg-gradient-to-r from-gold-500 to-yellow-600 text-black font-bold text-lg rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>

              <button onClick={() => navigate(-1)} className="w-full py-3 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Confirmation;
