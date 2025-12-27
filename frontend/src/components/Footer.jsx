import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      navigate('/register', { state: { email } });
    }
  };

  // Don't show footer on Admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white pt-20 pb-8 border-t border-gold-600/20 relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #EAB308 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand & Newsletter - Spans 4 columns */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="group relative flex items-center gap-4">
              {/* Icon Container */}
              <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gold-400 to-yellow-600 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-all duration-300 transform group-hover:rotate-12">
                <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-luxury text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-200 to-gold-500 drop-shadow-sm group-hover:from-gold-300 group-hover:to-yellow-100 transition-all duration-300">
                  FLIXGO
                </span>
                <span className="text-[0.65rem] text-gold-400/90 tracking-[0.4em] uppercase font-bold transform -translate-y-1 ml-0.5 group-hover:text-white/90 transition-colors duration-300">
                  PREMIUM CINEMA
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Experience the magic of cinema with FlixGo. Your premium destination for seamless movie ticket booking, exclusive premieres, and loyalty rewards.
            </p>

            <div className="pt-2">
              <h5 className="text-white font-bold mb-4 text-xs tracking-widest uppercase">Subscribe to Newsletter</h5>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  className="bg-white/5 border border-white/10 rounded-lg pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/10 w-full transition-all duration-300"
                />
                <button
                  onClick={handleSubscribe}
                  className="absolute right-1 top-1 bottom-1 bg-gold-500 text-black px-4 rounded-md font-bold text-lg hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/20"
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {/* Social Icons */}
              {[
                { href: "https://www.facebook.com/share/16ATUdDvvq/", icon: <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />, color: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
                { href: "https://x.com/Himesh5506", icon: <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />, color: "hover:bg-black hover:border-white" },
                { href: "https://www.youtube.com/@Flixxo-t2b", icon: <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />, color: "hover:bg-[#FF0000] hover:border-[#FF0000]" },
                { href: "https://www.linkedin.com/in/himesh-ambaliya-0a770628a/", icon: <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />, color: "hover:bg-[#0077b5] hover:border-[#0077b5]" }
              ].map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block col-span-1 border-r border-white/5 h-full mx-auto"></div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide border-b-2 border-gold-500 inline-block pb-1">Explore</h4>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Home", icon: "🏠" },
                { to: "/#movies", label: "Movies", icon: "🎬", isScroll: true },
                { to: "/about", label: "About Us", icon: "✨" },
                { to: "/feedback", label: "Feedback", icon: "💬" }
              ].map((link, idx) => (
                <li key={idx}>
                  {link.isScroll ? (
                    <div
                      onClick={() => {
                        if (location.pathname !== '/') window.location.href = '/#movies';
                        else document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="text-gold-500/70 group-hover:text-gold-400 group-hover:scale-110 transition-all duration-300 text-sm">{link.icon}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </div>
                  ) : (
                    <Link to={link.to} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-3 group">
                      <span className="text-gold-500/70 group-hover:text-gold-400 group-hover:scale-110 transition-all duration-300 text-sm">{link.icon}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide border-b-2 border-gold-500 inline-block pb-1">Experience</h4>
            <ul className="space-y-4">
              {[
                "24/7 Online Booking",
                "Premium Seat Selection",
                "Pre-order Snacks",
                "Loyalty Rewards"
              ].map((item, idx) => (
                <li key={idx} className="text-gray-400 flex items-center gap-3 hover:text-white transition-colors group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-bold mb-8 text-white tracking-wide border-b-2 border-gold-500 inline-block pb-1">Contact</h4>
            <div className="space-y-6 text-sm">
              <div className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5">
                <span className="text-xl p-2 bg-white/5 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">📍</span>
                <div>
                  <p className="font-bold text-white mb-1">Visit Us</p>
                  <p className="leading-relaxed">91 Cinema Street, Movie District,<br />Entertainment City, 395004</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5">
                <span className="text-xl p-2 bg-white/5 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">📞</span>
                <div>
                  <p className="font-bold text-white mb-1">Call Us</p>
                  <p>+(91) 8128677032</p>
                </div>
              </div>

              <a href="mailto:support@flixgo.com" className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5">
                <span className="text-xl p-2 bg-white/5 rounded-full text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">📧</span>
                <div>
                  <p className="font-bold text-white mb-1">Email Us</p>
                  <p>support@flixgo.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500 text-center md:text-left">
            <p>© 2025 FlixGo Entertainment. All Rights Reserved.</p>

          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">We Accept</span>
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 w-auto bg-white px-1 rounded-sm py-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto bg-white px-1 rounded-sm py-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6 w-auto bg-white px-1 rounded-sm py-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-6 w-auto bg-white px-1 rounded-sm py-0.5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-6 w-auto bg-white px-1 rounded-sm py-0.5" />
            </div>
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;
