import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, CloudSun, LocateFixed, Loader2, Palmtree, RadioTower, Mountain, Building2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../lib/motion';

import heroVideoPath from '../../assets/Hero-video.mp4';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Manali, India');
  const [isLocating, setIsLocating] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  const locateUser = () => {
    if (isLocating) return;
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using OpenStreetMap Nominatim (Free, no API key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await res.json();
          
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.address?.state;
          const country = data.address?.country;
          
          if (city) {
            const locString = country ? `${city}, ${country}` : city;
            setCurrentLocation(locString);
            setSearchQuery(city); // Pre-fill search so they can explore nearby
          }
        } catch (error) {
          console.error("Error fetching location", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or failed", error);
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Ask for location on initial load
  useEffect(() => {
    locateUser();
    // Lazy load the video slightly after initial render so the website loads instantly
    const timer = setTimeout(() => {
      setVideoSrc(heroVideoPath);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore');
    }
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-center pt-24 lg:pt-32 pb-16 overflow-hidden bg-[#111111]">
      {/* Background Video */}
      <div className="absolute inset-0 bg-[#0d1821]">
        
        {/* Lazily load the heavy local video file */}
        {videoSrc && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.6] transition-opacity duration-1000"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        
        {/* Gradient Overlay for Text Contrast and Edge Masking */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1821]/95 via-[#0d1821]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111111]/40 to-[#111111]/80" />
        
        {/* Advanced Smooth Fade to perfectly blend the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-7"
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3.5 mb-4 md:mb-5">
              <div className="w-7 md:w-9 h-[2px] bg-accent"></div>
              <span className="text-white tracking-widest text-xs md:text-xs font-semibold uppercase opacity-90">Discover the world</span>
            </motion.div>
            
            {/* Main Heading with Elegant Line Spacing */}
            <motion.h1 
              variants={fadeInUp}
              className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold mb-5 md:mb-6 tracking-tight leading-[1.15]"
            >
              Find your next
              <span className="font-instrument-serif italic text-accent font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] block mt-1.5 md:mt-2">
                adventure
              </span>
            </motion.h1>
            
            {/* Description Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-white/80 text-xs sm:text-sm md:text-base font-light max-w-xl mb-8 md:mb-10 leading-relaxed"
            >
              Explore amazing destinations, get real-time weather, discover places to visit, and plan unforgettable trips with your AI travel companion.
            </motion.p>

            {/* Search Bar with Generous Padding */}
            <motion.div variants={fadeInUp} className="bg-white rounded-full p-1.5 md:p-2 flex items-center shadow-2xl mb-6 md:mb-8 max-w-xl">
              <div className="flex items-center gap-3 flex-1 pl-3 md:pl-4 py-1 text-text w-full relative">
                <MapPin size={18} className="text-muted shrink-0 hidden sm:block" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Where to?" 
                  className="bg-transparent border-none outline-none w-full text-text placeholder:text-muted text-sm md:text-base"
                />
                
                <button 
                  onClick={locateUser}
                  disabled={isLocating}
                  className="p-1.5 text-muted hover:text-accent transition-colors disabled:opacity-50 cursor-pointer"
                  title="Use current location"
                >
                  {isLocating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                </button>
              </div>

              <Link to={searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore'} className="flex-shrink-0">
                <button className="w-10 h-10 md:w-11 md:h-11 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                  <Search size={17} />
                </button>
              </Link>
            </motion.div>

            {/* Popular Searches with Comfortable Spacing */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <span className="text-white/70 text-xs mr-1 font-medium tracking-wide">Popular:</span>
              {[
                { name: 'Bali', icon: <Palmtree size={13} className="opacity-80" /> },
                { name: 'Paris', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M12 2v20"/><path d="M8 22l4-15 4 15"/><path d="M5 14h14"/><path d="M8 10h8"/></svg> },
                { name: 'Tokyo', icon: <RadioTower size={13} className="opacity-80" /> },
                { name: 'Switzerland', icon: <Mountain size={13} className="opacity-80" /> },
                { name: 'Dubai', icon: <Building2 size={13} className="opacity-80" /> }
              ].map(place => (
                <Link key={place.name} to={`/explore?q=${place.name}`} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 text-white/90 text-xs hover:bg-white/10 hover:border-white/40 transition-all shadow-sm">
                  {place.icon}
                  {place.name}
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Weather Widget */}
          <div className="hidden lg:flex lg:col-span-5 justify-end items-center relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-7 rounded-3xl text-white shadow-2xl w-full max-w-[290px]"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-white" />
                <span className="font-semibold text-xs md:text-sm line-clamp-1 tracking-wide">{currentLocation}</span>
                <div className="ml-auto flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5 mb-5">
                <CloudSun size={38} className="text-accent drop-shadow-md" />
                <div>
                  <div className="text-4xl font-light tracking-tighter drop-shadow-sm">16<span className="text-2xl align-top text-white/90">°C</span></div>
                  <div className="text-xs font-medium text-white/90">Sunny</div>
                  <div className="text-[10px] text-white/60 tracking-wide">Feels like 15°</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-3 text-xs">
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Humidity</div>
                  <div className="font-semibold text-xs text-white/95">52%</div>
                </div>
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Wind</div>
                  <div className="font-semibold text-xs text-white/95">12 km/h</div>
                </div>
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Visibility</div>
                  <div className="font-semibold text-xs text-white/95">10 km</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}
