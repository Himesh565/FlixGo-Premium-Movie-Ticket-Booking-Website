import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
      ? 'bg-black/80 backdrop-blur-xl border-b border-gold-500/10 py-2 shadow-2xl'
      : 'bg-transparent py-6'
      }`}>
      {/* Top Gold Line for extra premium feel */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="w-full px-8 md:px-12">
        <div className="flex items-center justify-between relative h-16">

          {/* Logo Section (Extreme Left) */}
          <div className="flex-shrink-0">
            <Link to="/" className="group relative flex items-center gap-4">
              {/* Icon Container */}
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gold-400 to-yellow-600 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-all duration-300 transform group-hover:rotate-12">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-luxury text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-200 to-gold-500 drop-shadow-sm group-hover:from-gold-300 group-hover:to-yellow-100 transition-all duration-300">
                  FLIXGO
                </span>
                <span className="text-[0.6rem] text-gold-400/90 tracking-[0.4em] uppercase font-bold transform -translate-y-1 ml-0.5 group-hover:text-white/90 transition-colors duration-300">
                  PREMIUM CINEMA
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (Absolute Center) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-8 bg-black/40 backdrop-blur-md px-10 py-3 rounded-full border border-white/5 shadow-2xl shadow-black/50">
            <NavLink href="/" active={location.pathname === '/'}>Home</NavLink>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <NavLink href="/#movies" active={location.hash === '#movies'}>Movies</NavLink>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <NavLink href="/about" active={location.pathname === '/about'}>About</NavLink>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <NavLink href="/feedback" active={location.pathname === '/feedback'}>Feedback</NavLink>
          </div>

          {/* User Section (Extreme Right) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="hidden lg:flex px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-luxury font-bold tracking-wider text-xs rounded shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 transition-all"
                  >
                    ADMIN PANEL
                  </Link>
                )}

                <div className="relative group">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full border border-white/10 bg-black/40 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all duration-300"
                  >
                    <span className="font-luxury text-sm tracking-wider text-gold-100 group-hover:text-gold-400">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-gold-500/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>

                  {/* Dropdown for logout */}
                  <div className="absolute right-0 top-full mt-2 w-32 py-2 bg-black/90 backdrop-blur-xl border border-gold-500/20 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-luxury tracking-widest text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-luxury tracking-widest text-gray-300 hover:text-white transition-colors">
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gold-500 text-black font-luxury font-bold tracking-widest text-xs rounded hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Premium Nav Link Component
const NavLink = ({ href, children, active }) => {
  const isHash = href.startsWith('/#');

  const handleClick = (e) => {
    if (isHash) {
      if (window.location.pathname !== '/') {
        window.location.href = href;
        return;
      }
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`relative py-1 text-sm font-luxury tracking-widest transition-colors duration-300 group ${active ? 'text-gold-400' : 'text-gray-400 hover:text-white'}`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold-500 transform origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
    </a>
  );
};

export default Navbar;
