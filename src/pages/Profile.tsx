import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, MapPin, Heart, Globe, ChevronDown, Camera } from 'lucide-react';
import { pageTransition, fadeInUp, staggerContainer } from '../lib/motion';

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

import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, userData, signInWithGoogle, logout } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getInitialLanguage());

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

  const handleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full bg-[#F8F9FA] min-h-screen flex-1 flex flex-col pt-16 md:pt-[72px]"
    >
      {/* Cover Banner with Advanced Smooth Fade */}
      <div className="w-full h-40 md:h-72 lg:h-[340px] relative overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Smooth gradient fading perfectly into the page background */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#F8F9FA] to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-24 md:-mt-36 relative z-10 pb-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 md:gap-8">
          
          {/* Left Column: User Card */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 md:gap-6">
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Profile Avatar */}
              <div className="relative mb-3 md:mb-4">
                {user && user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                ) : (
                  <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                {user && (
                  <button className="absolute bottom-0 right-0 md:bottom-2 md:right-2 w-7 h-7 md:w-8 md:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white">
                    <Camera size={14} />
                  </button>
                )}
              </div>
              
              {/* User Info */}
              {user ? (
                <div className="w-full">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">{user.displayName || 'Travora Explorer'}</h1>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 truncate px-2">{user.email}</p>
                  
                  <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-2.5 md:p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors text-red-600 text-sm font-semibold">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
                  <p className="text-gray-500 text-xs mb-4 md:mb-6">Sign in to save your favorite destinations and plan trips.</p>
                  <button onClick={handleAuth} className="w-full p-2.5 md:p-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Content Areas */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4 md:gap-6 md:mt-24">
            
            {/* Stats / Quick Links */}
            {user && (
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button className="flex items-center p-3 md:p-5 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group text-left">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 mr-3 md:mr-4 group-hover:scale-110 transition-transform">
                    <Heart size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-bold text-sm md:text-base">Saved Destinations</h3>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">{userData?.savedDestinations.length || 0} places saved</p>
                  </div>
                </button>

                <button className="flex items-center p-3 md:p-5 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group text-left">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mr-3 md:mr-4 group-hover:scale-110 transition-transform">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-bold text-sm md:text-base">My Trips</h3>
                    <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">{userData?.myTrips.length || 0} planned trips</p>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Settings Card */}
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl border border-gray-100 shadow-sm relative z-10">
              <div className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-50 bg-gray-50/50 rounded-t-3xl">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                  <Settings size={18} className="text-gray-400" />
                  Preferences
                </h3>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="relative max-w-sm">
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Display Language</label>
                  <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-blue-500" />
                      <span className="font-medium text-sm text-gray-900">{currentLang.name}</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-20"
                      >
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang)}
                            className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${
                              currentLang.code === lang.code 
                                ? 'bg-blue-50 text-blue-600 font-semibold' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-sm">{lang.name}</span>
                            <span className="text-[10px] uppercase font-bold opacity-50 ml-3">{lang.display}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
