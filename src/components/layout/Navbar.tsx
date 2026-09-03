import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isHome = location.pathname === '/';
  const isDestination = location.pathname.startsWith('/destination');
  
  // The navbar should be white text when at the top of the Home or Destination pages
  // because both have dark image hero sections.
  const isLight = (isHome || isDestination) && !scrolled;
  const textColor = isLight ? 'text-white' : 'text-[#111111]';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`absolute md:fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E3DD] py-2.5 shadow-xs'
          : 'bg-transparent py-3 md:py-4'
      }`}
    >
      <nav
        className="w-full flex items-center justify-between px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14"
        aria-label="Main navigation"
      >
        {/* Brand - with comfortable left margin aligned with page layout */}
        <Link to="/" className={`flex items-start gap-2.5 transition-colors duration-300 shrink-0 ${textColor}`}>
          <Navigation className="text-accent fill-accent -rotate-45 mt-0.5 w-5 h-5 md:w-6 md:h-6" />
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold leading-none tracking-tight">Travora</span>
            <span className="text-[0.6rem] md:text-[0.65rem] opacity-70 mt-1 tracking-widest uppercase font-semibold">Discover. Plan. Go.</span>
          </div>
        </Link>

        {/* Desktop links - centered */}
        <div className={`hidden items-center gap-8 lg:flex ${textColor} font-semibold text-sm tracking-normal`}>
          {!isHome && (
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          )}
          <Link 
            to="/explore" 
            className={`transition-colors py-1.5 border-b-2 ${location.pathname === '/explore' || location.pathname.startsWith('/destination') ? 'border-accent text-accent' : 'border-transparent hover:text-accent'}`}
          >
            Explore
          </Link>

          <Link 
            to="/planner" 
            className={`transition-colors py-1.5 border-b-2 ${location.pathname === '/planner' ? 'border-accent text-accent' : 'border-transparent hover:text-accent'}`}
          >
            Trip Planner
          </Link>
          <Link 
            to="/assistant" 
            className={`transition-colors py-1.5 border-b-2 ${location.pathname === '/assistant' ? 'border-accent text-accent' : 'border-transparent hover:text-accent'}`}
          >
            AI Assistant
          </Link>
        </div>

        {/* Right side controls - positioned at the right */}
        <div className={`hidden md:flex items-center gap-4 shrink-0 ${textColor}`}>
          <Link 
            to="/profile"
            className="flex items-center gap-2 hover:text-accent transition-colors group"
            title="Go to Profile"
          >
            {user && user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className={`w-8 h-8 md:w-9 md:h-9 rounded-full object-cover transition-all ${
                  isLight ? 'border-2 border-white/20 hover:border-white/50' : 'border-2 border-border shadow-sm hover:border-accent'
                }`}
              />
            ) : (
              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors ${
                isLight ? 'bg-white/10 hover:bg-white/20 border border-white/20' : 'bg-primary border border-border hover:border-accent shadow-sm'
              }`}>
                <User size={16} />
              </div>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
