import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, LogOut, MapPin, Heart, Globe, ChevronDown, Trash2, ArrowRight, Sparkles, Calendar, Compass, Check
} from 'lucide-react';
import { pageTransition, fadeInUp, staggerContainer } from '../lib/motion';
import { destinations } from '../data/destinations';
import { getTravelImageSync } from '../services/images';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency, CURRENCIES } from '../contexts/CurrencyContext';
import { removeDestinationFromDb, removeTripFromDb } from '../lib/db';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'EN', display: 'EN', name: 'English' },
  { code: 'ES', display: 'ES', name: 'Español' },
  { code: 'FR', display: 'FR', name: 'Français' },
  { code: 'ZH-CN', display: 'ZH', name: '中文 (Mandarin)' },
  { code: 'DE', display: 'DE', name: 'Deutsch' },
];

function getInitialLanguage() {
  const match = document.cookie.match(/googtrans=\/en\/([a-z-]{2,5})/i);
  if (match && match[1]) {
    const code = match[1].toUpperCase();
    const found = LANGUAGES.find(l => l.code.toUpperCase() === code);
    if (found) return found;
  }
  return LANGUAGES[0];
}

export default function Profile() {
  const { user, userData, signInWithGoogle, logout, refreshUserData } = useAuth();
  const { currency: currentCurrency, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'favorites' | 'trips' | 'settings'>('favorites');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getInitialLanguage());
  const navigate = useNavigate();

  const savedDestinationsList = destinations.filter(d => 
    userData?.savedDestinations?.includes(d.id)
  );

  const savedTripsList = userData?.savedTrips || [];

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    
    if (lang.code === 'EN') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = `googtrans=/en/${lang.code.toLowerCase()}; path=/;`;
      document.cookie = `googtrans=/en/${lang.code.toLowerCase()}; path=/; domain=` + window.location.hostname;
    }
    
    window.location.reload();
  };

  const handleCurrencyChange = (curr: typeof CURRENCIES[0]) => {
    setCurrency(curr);
    setIsCurrencyOpen(false);
    toast.success(`Currency set to ${curr.code} (${curr.symbol})`);
  };

  const handleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleRemoveFavorite = async (destId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      await removeDestinationFromDb(user.uid, destId);
      await refreshUserData();
      toast.success('Removed from favorites');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleDeleteTrip = async (tripId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      await removeTripFromDb(user.uid, tripId);
      await refreshUserData();
      toast.success('Trip deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete trip');
    }
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full bg-[#FAFAF7] min-h-screen flex-1 flex flex-col pt-16 md:pt-[72px]"
    >
      {/* Cover Banner - Hidden on mobile, visible on tablet/desktop */}
      <div className="hidden md:block w-full h-72 lg:h-[340px] relative overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FAFAF7] to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 md:-mt-48 lg:-mt-56 relative z-10 pb-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          
          {/* Left Column: User Card */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 md:gap-6 sticky top-24">
            <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white via-[#FCFBFE] to-[#F7F5FF] text-gray-900 border border-purple-100/90 shadow-[0_10px_30px_-10px_rgba(85,56,238,0.12),0_2px_8px_rgba(0,0,0,0.04)]">
              {/* Subtle Ambient Light Shimmer */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />

              {user ? (
                <div className="relative z-10 flex flex-row md:flex-col items-center md:items-center gap-3.5 sm:gap-4 md:gap-0">
                  {/* Profile Avatar with Radiant Ring */}
                  <div className="shrink-0 md:mb-3.5 p-[2px] rounded-full bg-gradient-to-tr from-[#5538EE] via-pink-400 to-amber-300 shadow-sm">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        referrerPolicy="no-referrer" 
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-28 md:h-28 rounded-full object-cover bg-white border border-white" 
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-28 md:h-28 bg-gradient-to-tr from-purple-100 to-indigo-100 text-[#5538EE] rounded-full flex items-center justify-center font-bold text-lg md:text-3xl border border-white">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={24} className="text-purple-600 md:w-12 md:h-12" />}
                      </div>
                    )}
                  </div>

                  {/* User Info & Actions to the right of avatar on mobile */}
                  <div className="min-w-0 flex-1 md:w-full md:text-center">
                    <div className="hidden md:inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/70 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase mb-2">
                      <Sparkles size={10} className="text-purple-600" /> Explorer
                    </div>
                    
                    <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-tight truncate">
                      {user.displayName || 'Travora Explorer'}
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-[13px] mt-0.5 md:mb-4 truncate font-medium">
                      {user.email}
                    </p>
                    
                    <button 
                      onClick={logout} 
                      className="mt-2.5 md:mt-0 inline-flex md:w-full items-center justify-center gap-1.5 px-3.5 py-1.5 md:py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-xl text-xs md:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <LogOut size={13} className="md:w-4 md:h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                  <div className="w-14 h-14 md:w-24 md:h-24 bg-purple-50 rounded-full flex items-center justify-center mb-3 border border-purple-100 shadow-sm text-purple-600">
                    <User size={26} className="md:w-10 md:h-10" />
                  </div>
                  <h1 className="text-base md:text-xl font-bold text-gray-900 mb-1">Welcome Explorer</h1>
                  <p className="text-gray-500 text-xs mb-3 md:mb-5">Sign in to save your favorite destinations and plan trips.</p>
                  <button onClick={handleAuth} className="w-full p-2.5 md:p-3 bg-[#5538EE] hover:bg-[#472ED4] text-white font-semibold rounded-xl transition-all text-xs md:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Content Areas */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4 md:gap-6">
            
            {/* Navigation Tabs */}
            {user && (
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-2 md:gap-4">
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center p-2.5 sm:p-3 md:p-5 rounded-2xl md:rounded-3xl border transition-all text-left cursor-pointer ${
                    activeTab === 'favorites' 
                      ? 'bg-white border-pink-200 shadow-md ring-2 ring-pink-400/20' 
                      : 'bg-white/70 border-gray-100 hover:bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mr-2 md:mr-4 shrink-0">
                    <Heart size={15} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-gray-900 font-bold text-xs md:text-base truncate">Favorites</h3>
                    <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs">{savedDestinationsList.length} places</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('trips')}
                  className={`flex items-center p-2.5 sm:p-3 md:p-5 rounded-2xl md:rounded-3xl border transition-all text-left cursor-pointer ${
                    activeTab === 'trips' 
                      ? 'bg-white border-purple-200 shadow-md ring-2 ring-purple-400/20' 
                      : 'bg-white/70 border-gray-100 hover:bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mr-2 md:mr-4 shrink-0">
                    <Compass size={15} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-gray-900 font-bold text-xs md:text-base truncate">My Trips</h3>
                    <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs">{savedTripsList.length} planned</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center p-2.5 sm:p-3 md:p-5 rounded-2xl md:rounded-3xl border transition-all text-left cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-400/20' 
                      : 'bg-white/70 border-gray-100 hover:bg-white'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mr-2 md:mr-4 shrink-0">
                    <Settings size={15} className="md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-gray-900 font-bold text-xs md:text-base truncate">Settings</h3>
                    <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs">Preferences</p>
                  </div>
                </button>
              </motion.div>
            )}

            {/* TAB CONTENT: FAVORITES */}
            {activeTab === 'favorites' && user && (
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="font-bold text-gray-900 text-base md:text-xl flex items-center gap-2">
                    <Heart size={18} className="text-pink-500 fill-pink-500" /> Saved Destinations
                  </h3>
                  <Link to="/explore" className="text-xs text-blue-600 font-semibold hover:underline">
                    + Explore more
                  </Link>
                </div>

                {savedDestinationsList.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-2.5">
                      <Heart size={18} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-xs md:text-base">No favorites yet</h4>
                    <p className="text-gray-500 text-[11px] md:text-sm mb-3">Click the heart icon on any destination to save it here.</p>
                    <Link to="/explore" className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-gray-800 transition-colors">
                      Discover Destinations <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    {savedDestinationsList.map(dest => {
                      const imgUrl = getTravelImageSync(dest.id);
                      return (
                        <Link 
                          key={dest.id}
                          to={`/destination/${dest.id}`}
                          className="group relative flex items-center bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                          {/* Compact image on mobile (h-20 w-20), scales up on tablet/desktop */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 overflow-hidden bg-gray-200">
                            <img src={imgUrl} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between min-w-0 h-full py-2">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate leading-snug">{dest.name}</h4>
                                <button
                                  onClick={(e) => handleRemoveFavorite(dest.id, e)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-white shrink-0 cursor-pointer"
                                  title="Remove from favorites"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <p className="text-gray-500 text-[10px] sm:text-xs flex items-center gap-1 mt-0.5">
                                <MapPin size={11} /> {dest.country}
                              </p>
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1.5">
                              View destination <ArrowRight size={11} />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB CONTENT: MY TRIPS */}
            {activeTab === 'trips' && user && (
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="font-bold text-gray-900 text-base md:text-xl flex items-center gap-2">
                    <Compass size={18} className="text-purple-600" /> My Planned Trips
                  </h3>
                  <Link to="/planner" className="text-xs text-purple-600 font-semibold hover:underline">
                    + Plan new trip
                  </Link>
                </div>

                {savedTripsList.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2.5">
                      <Calendar size={18} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-xs md:text-base">No trips planned yet</h4>
                    <p className="text-gray-500 text-[11px] md:text-sm mb-3">Let Waylo craft your dream itinerary in seconds.</p>
                    <Link to="/planner" className="inline-flex items-center gap-1.5 bg-[#5538EE] text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[#4A2699] transition-colors">
                      <Sparkles size={13} /> Plan a Trip with AI
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5 md:space-y-3">
                    {savedTripsList.map((trip) => (
                      <div 
                        key={trip.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 hover:border-purple-200 transition-all gap-2.5 sm:gap-3"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 font-bold text-xs sm:text-sm">
                            <Sparkles size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">{trip.destination}</h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                              {trip.duration} • Created {new Date(trip.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => navigate('/planner', { state: { itineraryData: trip.itinerary } })}
                            className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            View Itinerary <ArrowRight size={11} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteTrip(trip.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg sm:rounded-xl hover:bg-white transition-colors cursor-pointer shrink-0"
                            title="Delete trip"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB CONTENT: SETTINGS (OR IF NOT LOGGED IN) */}
            {(activeTab === 'settings' || !user) && (
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm relative z-10">
                <div className="px-4 py-3.5 md:px-6 md:py-5 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl md:rounded-t-3xl">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-xs sm:text-sm md:text-base">
                    <Settings size={16} className="text-gray-400" />
                    Preferences
                  </h3>
                </div>
                
                <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Display Language */}
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Display Language</label>
                    <button 
                      onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrencyOpen(false); }}
                      className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Globe size={16} className="text-blue-500 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">{currentLang.name}</span>
                      </div>
                      <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isLangOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-30 max-h-60 overflow-y-auto no-scrollbar"
                        >
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang)}
                              className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between cursor-pointer ${
                                currentLang.code === lang.code 
                                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-xs sm:text-sm">{lang.name}</span>
                              <span className="text-[10px] uppercase font-bold opacity-50 ml-3">{lang.display}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Preferred Currency */}
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferred Currency</label>
                    <button 
                      onClick={() => { setIsCurrencyOpen(!isCurrencyOpen); setIsLangOpen(false); }}
                      className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base select-none shrink-0">{currentCurrency.flag}</span>
                        <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">{currentCurrency.name}</span>
                      </div>
                      <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isCurrencyOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-30 max-h-60 overflow-y-auto no-scrollbar"
                        >
                          {CURRENCIES.map((curr) => (
                            <button
                              key={curr.code}
                              onClick={() => handleCurrencyChange(curr)}
                              className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between cursor-pointer ${
                                currentCurrency.code === curr.code 
                                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{curr.flag}</span>
                                <span className="text-xs sm:text-sm">{curr.name}</span>
                              </div>
                              {currentCurrency.code === curr.code && (
                                <Check size={14} className="text-emerald-600 shrink-0" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
