import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Loader2, Palmtree, RadioTower, Building2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../lib/motion';
import { useWeather } from '../../hooks/useWeather';

import heroVideoPath from '../../assets/Hero-video.mp4';
import heroImagePath from '../../assets/Hero-Image.png';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 }); // Default: Bengaluru
  const [currentLocation, setCurrentLocation] = useState<string>('Bengaluru, India');
  const [isLocating, setIsLocating] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  const { weather } = useWeather(coords.lat, coords.lng);

  // 1. Instant silent IP-based geolocation on mount (0.2s, no browser prompt, no stuck spinner)
  const detectLocationByIP = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.latitude && data.longitude) {
          setCoords({ lat: data.latitude, lng: data.longitude });
          const loc = data.city ? (data.country ? `${data.city}, ${data.country}` : data.city) : data.country;
          if (loc) {
            setCurrentLocation(loc);
          }
        }
      }
    } catch {
      // Fallback silently if offline or blocked
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  // 2. High-precision device GPS on user click with guaranteed timeout cleanup
  const locateUserGPS = useCallback(() => {
    if (isLocating) return;
    setIsLocating(true);

    // Hard safety guard: guarantee spinner stops after 5s no matter what happens
    const safetyTimer = setTimeout(() => {
      setIsLocating(false);
    }, 5000);

    if (!navigator.geolocation) {
      clearTimeout(safetyTimer);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 3500);

        try {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });

          // Fast reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { signal: controller.signal }
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || data.address?.state;
            const country = data.address?.country;
            if (city) {
              const locString = country ? `${city}, ${country}` : city;
              setCurrentLocation(locString);
              setSearchQuery(city);
            }
          }
        } catch {
          // If reverse geocoding times out, coords are already saved
        } finally {
          clearTimeout(fetchTimeout);
          clearTimeout(safetyTimer);
          setIsLocating(false);
        }
      },
      () => {
        clearTimeout(safetyTimer);
        setIsLocating(false);
      },
      { timeout: 4000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, [isLocating]);

  // Initial load
  useEffect(() => {
    detectLocationByIP();

    // Lazy load the video slightly after initial render so the website loads instantly
    const timer = setTimeout(() => {
      setVideoSrc(heroVideoPath);
    }, 100);
    return () => clearTimeout(timer);
  }, [detectLocationByIP]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore');
    }
  };

  return (
    <section className="relative h-full min-h-[100dvh] w-full flex flex-col justify-center pt-20 sm:pt-24 lg:pt-32 pb-24 sm:pb-16 overflow-hidden bg-[#111111]">
      {/* Background Media */}
      <div className="absolute inset-0 bg-[#0d1821] pointer-events-none select-none">
        
        {/* Instant Poster Image for 0.1s visual render (fades out when video plays) */}
        <img
          src={heroImagePath}
          alt="Hero background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-[0.65]'
          }`}
          fetchPriority="high"
        />

        {/* Lazily load the local video with instant poster image */}
        {videoSrc && (
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            poster={heroImagePath}
            onPlaying={() => setIsVideoPlaying(true)}
            onLoadedData={() => setIsVideoPlaying(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.6] transition-opacity duration-1000 pointer-events-none select-none"
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

      <div className="relative z-10 mx-auto max-w-[1920px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Content - Aligned perfectly with Travora logo */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-7"
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3.5 mb-4 md:mb-5">
              <div className="w-7 md:w-9 h-[2px] bg-accent"></div>
              <span className="text-white tracking-widest text-xs font-semibold uppercase opacity-90">Discover the world</span>
            </motion.div>
            
            {/* Main Heading with Elegant Line Spacing */}
            <motion.h1 
              variants={fadeInUp}
              className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-semibold mb-5 md:mb-6 tracking-tight leading-[1.15]"
            >
              Find your next
              <span className="font-instrument-serif italic text-accent font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] block mt-1.5 md:mt-2">
                adventure
              </span>
            </motion.h1>
            
            {/* Description Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-white/85 text-xs sm:text-sm md:text-base font-light max-w-xl mb-8 md:mb-10 leading-relaxed"
            >
              Explore amazing destinations, get real-time weather, discover places to visit, and plan unforgettable trips with your AI travel companion.
            </motion.p>

            {/* Search Bar with Soft Frosted Pearl/Glass Tint */}
            <motion.div 
              variants={fadeInUp} 
              className="relative group max-w-xl mb-6 md:mb-8"
            >
              {/* Soft ambient backlight */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-white/15 to-purple-400/15 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

              <div className="relative bg-[#FAFAF7]/90 hover:bg-white focus-within:bg-white backdrop-blur-2xl border border-white/60 focus-within:border-amber-400/60 rounded-full p-1.5 md:p-2 flex items-center shadow-[0_12px_36px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] focus-within:ring-4 focus-within:ring-amber-400/20 transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 pl-3.5 md:pl-4 py-1 text-gray-900 w-full relative">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0 hidden sm:flex shadow-2xs">
                    <MapPin size={16} className="text-amber-600" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Where to? (e.g. Goa, Paris, Tokyo...)" 
                    className="bg-transparent border-none outline-none w-full text-gray-900 placeholder:text-gray-400 text-sm md:text-base font-medium tracking-wide"
                  />
                  
                  <button 
                    onClick={locateUserGPS}
                    disabled={isLocating}
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full aspect-square bg-black/[0.04] hover:bg-amber-500/15 text-gray-500 hover:text-amber-600 border border-black/[0.06] hover:border-amber-400/40 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0 group/locate shadow-2xs mr-2 md:mr-2.5"
                    title={isLocating ? "Detecting your location..." : `Current Location: ${currentLocation} (Click to detect)`}
                  >
                    {isLocating ? (
                      <Loader2 size={18} className="animate-spin text-amber-500" />
                    ) : (
                      <Navigation size={17} className="fill-amber-500/20 text-amber-600 group-hover/locate:scale-110 group-hover/locate:-rotate-12 transition-transform duration-300" />
                    )}
                  </button>
                </div>

                <Link to={searchQuery ? `/explore?q=${encodeURIComponent(searchQuery)}` : '/explore'} className="flex-shrink-0">
                  <button className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-tr from-[#FF9E00] to-[#FFC72C] hover:from-[#FF8C00] hover:to-[#FFB800] text-gray-950 font-bold rounded-full flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(255,184,0,0.4)] hover:shadow-[0_6px_22px_rgba(255,184,0,0.6)] cursor-pointer hover:scale-105 active:scale-95">
                    <Search size={18} strokeWidth={2.5} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Popular Searches with Comfortable Spacing */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <span className="text-white/70 text-xs mr-1 font-medium tracking-wide">Popular:</span>
              {[
                { name: 'Goa', icon: <Palmtree size={13} className="opacity-80" /> },
                { name: 'Jaipur', icon: <Building2 size={13} className="opacity-80" /> },
                { name: 'Bali', icon: <Palmtree size={13} className="opacity-80" /> },
                { name: 'Paris', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M12 2v20"/><path d="M8 22l4-15 4 15"/><path d="M5 14h14"/><path d="M8 10h8"/></svg> },
                { name: 'Tokyo', icon: <RadioTower size={13} className="opacity-80" /> },
                { name: 'Dubai', icon: <Building2 size={13} className="opacity-80" /> }
              ].map(place => (
                <Link key={place.name} to={`/explore?q=${place.name}`} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 text-white/90 text-xs hover:bg-white/10 hover:border-white/40 transition-all shadow-sm">
                  {place.icon}
                  {place.name}
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Weather Widget Aligned with Profile Avatar */}
          <div className="hidden lg:flex lg:col-span-5 justify-end items-center relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="bg-black/10 hover:bg-black/15 backdrop-blur-md border border-white/10 p-6 md:p-7 rounded-[2rem] text-white shadow-xl transition-all duration-300 w-full max-w-[310px]"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-white/90" />
                <span className="font-semibold text-xs md:text-sm line-clamp-1 tracking-wide text-white/95">{currentLocation}</span>
                <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5 mb-5">
                <span className="text-4xl drop-shadow-md select-none">{weather?.icon || '☀️'}</span>
                <div>
                  <div className="text-4xl font-light tracking-tighter drop-shadow-sm text-white">
                    {weather?.temp ?? 24}<span className="text-2xl align-top text-white/85">°C</span>
                  </div>
                  <div className="text-xs font-medium text-white/90">{weather?.condition || 'Sunny'}</div>
                  <div className="text-[10px] text-white/60 tracking-wide">Feels like {weather?.feelsLike ?? 25}°</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3.5 text-xs">
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Humidity</div>
                  <div className="font-semibold text-xs text-white/95">{weather?.humidity ?? 52}%</div>
                </div>
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Wind</div>
                  <div className="font-semibold text-xs text-white/95">{weather?.windSpeed ?? 12} km/h</div>
                </div>
                <div>
                  <div className="text-white/60 mb-0.5 tracking-wider uppercase text-[8px] font-bold">Visibility</div>
                  <div className="font-semibold text-xs text-white/95">{weather?.visibility ?? 10} km</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </section>
  );
}
