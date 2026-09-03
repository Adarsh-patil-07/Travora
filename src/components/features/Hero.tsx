import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Play, CloudSun, LocateFixed, Loader2, Palmtree, RadioTower, Mountain, Building2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../lib/motion';

import heroVideoPath from '../../assets/Hero-video.mp4';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Manali, India');
  const [isLocating, setIsLocating] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const navigate = useNavigate();
  const bgImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore');
    }
  };

  return (
    <section className="relative h-full w-full flex flex-col justify-center pt-20 lg:pt-32 pb-12 overflow-hidden bg-[#111111]">
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
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-12 xl:px-16 w-full lg:mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="w-8 xl:w-12 h-[2px] bg-accent"></div>
              <span className="text-white tracking-widest text-xs xl:text-sm font-semibold uppercase">Discover the world</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-white text-[2.25rem] sm:text-5xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] lg:leading-[1.1] font-semibold mb-4 md:mb-6 tracking-tight"
            >
              Find your next <br />
              <span className="font-instrument-serif italic text-accent font-normal text-[2.75rem] sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7.5rem] block -mt-1 lg:mt-0">adventure</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-white/80 text-xs sm:text-sm md:text-base xl:text-lg font-light max-w-[280px] sm:max-w-md xl:max-w-xl mb-8 md:mb-10 leading-relaxed"
            >
              Explore amazing destinations, get real-time weather, discover places to visit, and plan unforgettable trips with your AI travel companion.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="bg-white rounded-full p-1 lg:p-1.5 flex items-center shadow-2xl mb-6 md:mb-8 max-w-full lg:max-w-md xl:max-w-xl">
              <div className="flex items-center gap-2 md:gap-3 flex-1 pl-3 md:pl-4 py-1 xl:py-2 text-text w-full relative">
                <MapPin size={18} className="text-muted shrink-0 xl:w-6 xl:h-6 hidden sm:block" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Where to?" 
                  className="bg-transparent border-none outline-none w-full text-text placeholder:text-muted text-sm sm:text-base xl:text-lg"
                />
                
                <button 
                  onClick={locateUser}
                  disabled={isLocating}
                  className="p-2 text-muted hover:text-accent transition-colors disabled:opacity-50"
                  title="Use current location"
                >
                  {isLocating ? <Loader2 size={14} className="animate-spin xl:w-5 xl:h-5" /> : <LocateFixed size={14} className="xl:w-5 xl:h-5" />}
                </button>
              </div>

              <Link to={searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore'} className="flex-shrink-0">
                <button className="w-9 h-9 md:w-12 md:h-12 xl:w-14 xl:h-14 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Search size={16} className="xl:w-6 xl:h-6" />
                </button>
              </Link>
            </motion.div>

            {/* Popular Searches */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-1.5 sm:gap-2 xl:gap-4 mt-2">
              <span className="text-white/70 text-[9px] sm:text-[10px] xl:text-sm mr-1 font-medium tracking-wide w-full sm:w-auto mb-1 sm:mb-0">Popular searches:</span>
              {[
                { name: 'Bali', icon: <Palmtree size={12} className="opacity-80 sm:w-[14px]" /> },
                { name: 'Paris', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 sm:w-[14px] sm:h-[14px]"><path d="M12 2v20"/><path d="M8 22l4-15 4 15"/><path d="M5 14h14"/><path d="M8 10h8"/></svg> },
                { name: 'Tokyo', icon: <RadioTower size={12} className="opacity-80 sm:w-[14px]" /> },
                { name: 'Switzerland', icon: <Mountain size={12} className="opacity-80 sm:w-[14px]" /> },
                { name: 'Dubai', icon: <Building2 size={12} className="opacity-80 sm:w-[14px]" /> }
              ].map(place => (
                <Link key={place.name} to={`/explore?q=${place.name}`} className="flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-1.5 xl:px-5 xl:py-2 rounded-full border border-white/20 text-white/90 text-[10px] sm:text-xs xl:text-sm hover:bg-white/10 hover:border-white/40 transition-all shadow-sm">
                  {place.icon}
                  {place.name}
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Weather Widget & Play Button */}
          <div className="hidden lg:flex flex-col justify-center items-end gap-6 xl:gap-8 relative h-full">
            
            {/* Glass Weather Widget */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 xl:p-8 rounded-3xl text-white shadow-2xl w-[280px] xl:w-[340px] mt-[-20px]"
            >
              <div className="flex items-center gap-2 mb-5 xl:mb-7">
                <MapPin size={16} className="text-white xl:w-5 xl:h-5" />
                <span className="font-semibold text-sm xl:text-base line-clamp-1 tracking-wide">{currentLocation}</span>
                <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 xl:gap-5 mb-7 xl:mb-8">
                <CloudSun size={42} className="text-accent xl:w-14 xl:h-14 drop-shadow-md" />
                <div>
                  <div className="text-5xl xl:text-6xl font-light tracking-tighter drop-shadow-sm">16<span className="text-2xl xl:text-4xl align-top text-white/90">°C</span></div>
                  <div className="text-sm xl:text-base font-medium mt-1 text-white/90">Sunny</div>
                  <div className="text-[10px] xl:text-xs text-white/60 tracking-wide mt-0.5">Feels like 15°</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 border-t border-white/20 pt-4 xl:pt-5 text-xs xl:text-sm">
                <div>
                  <div className="text-white/60 mb-1 tracking-wider uppercase text-[9px] xl:text-[10px] font-bold">Humidity</div>
                  <div className="font-semibold text-white/95">52%</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1 tracking-wider uppercase text-[9px] xl:text-[10px] font-bold">Wind</div>
                  <div className="font-semibold text-white/95">12 km/h</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1 tracking-wider uppercase text-[9px] xl:text-[10px] font-bold">Visibility</div>
                  <div className="font-semibold text-white/95">10 km</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden lg:flex absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 cursor-pointer z-20 hover:opacity-80 transition-opacity"
        onClick={() => window.scrollBy({ top: window.innerHeight - 100, behavior: 'smooth' })}
      >
        <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-semibold hidden lg:block mb-1">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center pt-1.5 md:pt-2"
        >
          <div className="w-1 h-1.5 md:w-1.5 md:h-2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>

    </section>
  );
}
