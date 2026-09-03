import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Map, Download, Edit2, Sparkles, ArrowRight, Navigation, X, Loader2, Calendar, Compass, BookmarkCheck, Bookmark, UserCheck, LogIn
} from 'lucide-react';
import { pageTransition, fadeInUp } from '../lib/motion';
import { generateItinerary } from '../services/ai';
import { useAuth } from '../contexts/AuthContext';
import { saveTripToDb } from '../lib/db';
import { destinations } from '../data/destinations';
import { destinationImages } from './Destination';
import type { SavedTrip } from '../lib/db';
import toast from 'react-hot-toast';
import type { Itinerary } from '../types';

const getTagForActivity = (title: string, desc: string) => {
  const text = (title + ' ' + desc).toLowerCase();
  if (text.includes('lunch') || text.includes('dinner') || text.includes('food') || text.includes('restaurant') || text.includes('eat') || text.includes('cafe')) {
    return { tag: 'Food', color: 'bg-orange-50 text-orange-700' };
  }
  if (text.includes('museum') || text.includes('temple') || text.includes('shrine') || text.includes('history') || text.includes('art') || text.includes('culture') || text.includes('palace')) {
    return { tag: 'Culture', color: 'bg-emerald-50 text-emerald-700' };
  }
  if (text.includes('park') || text.includes('garden') || text.includes('nature') || text.includes('mountain') || text.includes('lake') || text.includes('beach')) {
    return { tag: 'Nature', color: 'bg-blue-50 text-blue-700' };
  }
  return { tag: 'Sightseeing', color: 'bg-purple-50 text-purple-700' };
};

const getDestinationImage = (destinationName?: string): string => {
  if (!destinationName) return destinationImages['bali'];
  const nameLower = destinationName.toLowerCase();

  // 1. Direct match with curated destinations catalogue
  const matched = destinations.find(d => 
    nameLower.includes(d.name.toLowerCase()) || 
    nameLower.includes(d.id.toLowerCase()) ||
    d.name.toLowerCase().includes(nameLower)
  );
  if (matched && destinationImages[matched.id]) {
    return destinationImages[matched.id];
  }

  // 2. Direct key lookup (e.g. 'bali', 'paris', 'tokyo', etc.)
  for (const [key, img] of Object.entries(destinationImages)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return img;
    }
  }

  // 3. Fallback to destination photo
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(destinationName + ' landmark landscape photography 4k')}?width=1200&height=600&nologo=true`;
};

const getActivityImage = (title: string, desc: string, index: number) => {
  const text = (title + ' ' + desc).toLowerCase();
  
  if (text.includes('food') || text.includes('lunch') || text.includes('dinner') || text.includes('breakfast') || text.includes('cafe') || text.includes('restaurant') || text.includes('market') || text.includes('eat')) {
    const foodImages = [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    ];
    return foodImages[index % foodImages.length];
  }
  
  if (text.includes('temple') || text.includes('shrine') || text.includes('history') || text.includes('museum') || text.includes('palace') || text.includes('culture') || text.includes('monument')) {
    const cultureImages = [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
    ];
    return cultureImages[index % cultureImages.length];
  }

  if (text.includes('beach') || text.includes('sea') || text.includes('ocean') || text.includes('island') || text.includes('coast') || text.includes('surf')) {
    const beachImages = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=800&auto=format&fit=crop',
    ];
    return beachImages[index % beachImages.length];
  }

  if (text.includes('nature') || text.includes('park') || text.includes('mountain') || text.includes('hike') || text.includes('waterfall') || text.includes('forest') || text.includes('viewpoint') || text.includes('sunset')) {
    const natureImages = [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop',
    ];
    return natureImages[index % natureImages.length];
  }

  const sightImages = [
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
  ];
  return sightImages[index % sightImages.length];
};

export default function Planner() {
  const location = useLocation();
  const { user, userData, signInWithGoogle, refreshUserData } = useAuth();
  const [itinerary, setItinerary] = useState<Itinerary | undefined>(location.state?.itineraryData);
  const [activeDay, setActiveDay] = useState(1);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destInput, setDestInput] = useState('');
  const [daysInput, setDaysInput] = useState('3');
  const [preferencesInput, setPreferencesInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if location.state changes
  useEffect(() => {
    if (location.state?.itineraryData) {
      setItinerary(location.state.itineraryData);
      setActiveDay(1);
    }
  }, [location.state]);

  const isTripSaved = Boolean(
    itinerary && userData?.savedTrips?.some(t => t.destination.toLowerCase() === itinerary.destination.toLowerCase())
  );

  const saveCurrentTrip = async (itineraryToSave: Itinerary) => {
    if (!user) return;
    try {
      setIsSaving(true);
      const newTrip: SavedTrip = {
        id: Date.now().toString(),
        destination: itineraryToSave.destination,
        duration: itineraryToSave.duration,
        createdAt: new Date().toISOString(),
        itinerary: itineraryToSave,
      };
      await saveTripToDb(user.uid, newTrip);
      await refreshUserData();
      toast.success('Trip saved to your profile!');
    } catch (err) {
      console.error('Error saving trip:', err);
      toast.error('Failed to save trip to profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destInput.trim()) {
      toast.error('Please enter a destination');
      return;
    }

    setIsGenerating(true);
    const loadingId = toast.loading('Waylo is crafting your itinerary...');
    try {
      const data = await generateItinerary(destInput.trim(), parseInt(daysInput) || 3, preferencesInput.trim());
      setItinerary(data);
      setActiveDay(1);
      setIsModalOpen(false);
      toast.success('Itinerary generated successfully!', { id: loadingId });

      // Automatically save to Firestore if user is logged in
      if (user) {
        await saveCurrentTrip(data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate itinerary', { id: loadingId });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDayData = itinerary?.days.find(d => d.day === activeDay) || itinerary?.days[0];
  const destImage = getDestinationImage(itinerary?.destination);

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAFAF7] pt-20 md:pt-24 pb-20"
    >
      {/* POPUP MODAL FOR PLANNING A TRIP */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isGenerating}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-2xs border border-purple-100 shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Plan a Trip with AI</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Let Waylo generate your customized day-by-day plan</p>
                </div>
              </div>

              {/* Generator Form */}
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Destination</label>
                  <div className="relative">
                    <Map size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={destInput}
                      onChange={e => setDestInput(e.target.value)}
                      placeholder="e.g. Kyoto, Japan or Rome, Italy" 
                      required
                      className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm md:text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Duration (Days)</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      min="1" max="14"
                      value={daysInput}
                      onChange={e => setDaysInput(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm md:text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Travel Preferences (Optional)</label>
                  <div className="relative">
                    <Compass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={preferencesInput}
                      onChange={e => setPreferencesInput(e.target.value)}
                      placeholder="e.g. foodie focus, art museums, relaxed pace" 
                      className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm md:text-base focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-2xl py-3.5 text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
                  >
                    {isGenerating ? (
                      <><Loader2 size={18} className="animate-spin" /> Crafting Itinerary...</>
                    ) : (
                      <><Sparkles size={18} /> Generate Plan</>
                    )}
                  </button>

                  {/* Login / Auto-save guidance note */}
                  <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-1">
                    {user ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <UserCheck size={13} /> Logged in: trip will auto-save to your profile
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Bookmark size={13} className="text-purple-500" /> 
                        <button type="button" onClick={signInWithGoogle} className="text-purple-600 font-semibold underline hover:text-purple-800">
                          Log in
                        </button> 
                        to save this trip to your account
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMPTY STATE */}
      {!itinerary ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-5 md:mb-6 text-purple-600 shadow-sm border border-purple-100">
              <Map size={30} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2.5 tracking-tight">No Trip Planned Yet</h2>
            <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">
              Generate a custom, day-by-day itinerary with Waylo, your personal AI travel companion.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5538EE] text-white px-7 py-3 md:px-8 md:py-3.5 rounded-full text-sm font-semibold hover:bg-[#4A2699] transition-all flex items-center justify-center gap-2 mx-auto w-fit shadow-md hover:shadow-lg cursor-pointer"
            >
              <Sparkles size={16} /> Plan a Trip with AI
            </button>

            {/* Login Guidance Message */}
            {!user ? (
              <div className="mt-8 p-3.5 bg-purple-50/70 border border-purple-100/90 rounded-2xl flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Bookmark size={13} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Want to keep your trips?</p>
                    <p className="text-[11px] text-gray-500">Log in to save all your planned trips to your account.</p>
                  </div>
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="px-3 py-1.5 bg-[#5538EE] hover:bg-[#4A2699] text-white text-[11px] font-semibold rounded-xl shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <LogIn size={11} /> Log in
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-600 font-medium mt-4 flex items-center justify-center gap-1">
                <UserCheck size={13} /> Logged in as {user.displayName || user.email}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* PLANNED ITINERARY VIEW */
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">
              
              {/* Trip Summary Card */}
              <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xl font-bold text-gray-900">Your Trip</h2>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs text-[#5538EE] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + New trip
                  </button>
                </div>
                
                <div className="relative h-32 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <img 
                    src={destImage} 
                    alt={itinerary.destination} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{itinerary.destination}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-1">{itinerary.duration} • AI Planned</p>
                  <p className="text-xs text-gray-500 font-medium">Personalized Itinerary</p>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                  {user ? (
                    <button 
                      onClick={() => saveCurrentTrip(itinerary)}
                      disabled={isSaving}
                      className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isTripSaved 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-[#5538EE] text-white hover:bg-[#4A2699] shadow-sm'
                      }`}
                    >
                      {isTripSaved ? (
                        <><BookmarkCheck size={16} /> Saved in Profile</>
                      ) : (
                        <><Bookmark size={16} /> Save to Profile</>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={signInWithGoogle}
                      className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <LogIn size={14} /> Log in to save this trip
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      setDestInput(itinerary.destination);
                      setIsModalOpen(true);
                    }}
                    className="w-full py-2.5 flex items-center justify-center gap-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} /> Plan another trip
                  </button>
                </div>
              </div>

              {/* Day Tabs */}
              <div className="flex flex-col gap-2">
                {itinerary.days.map((dayObj) => (
                  <div 
                    key={dayObj.day}
                    onClick={() => setActiveDay(dayObj.day)}
                    className={`p-4 rounded-2xl cursor-pointer transition-colors ${activeDay === dayObj.day ? 'bg-[#F4F0FF] text-[#5538EE]' : 'hover:bg-gray-50 text-gray-500'}`}
                  >
                    <div className={`text-sm font-bold ${activeDay === dayObj.day ? 'text-[#5538EE]' : 'text-gray-900'}`}>Day {dayObj.day}</div>
                    <div className="text-xs mt-1 font-medium">{dayObj.title}</div>
                  </div>
                ))}
              </div>

              {/* Waylo Upsell Card */}
              <div className="bg-gradient-to-br from-[#F4F0FF] to-[#E9E0FF] rounded-[2rem] p-6 border border-purple-100 relative overflow-hidden mt-2">
                <div className="relative z-10 w-[70%]">
                  <div className="flex items-center gap-2 text-[#4A2699] font-bold mb-4">
                    <Sparkles size={18} /> Waylo
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 leading-tight">Need changes to your trip?</h4>
                  <p className="text-xs text-gray-600 mb-5 leading-relaxed font-medium">
                    Ask Waylo to adjust your itinerary, add places, or find the best experiences.
                  </p>
                  <Link to="/assistant">
                    <button className="bg-white text-[#5538EE] text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
                      Chat with Waylo <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
                
                <div className="absolute -bottom-2 -right-4 w-32 h-32 opacity-90 flex items-center justify-center bg-purple-200 rounded-full mix-blend-multiply">
                   <Navigation size={48} className="text-purple-500 -rotate-45" />
                </div>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {currentDayData && (
              <div className="flex-1">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-6 md:mb-10">
                  <div>
                    <h1 className="text-lg md:text-[28px] font-bold text-gray-900 mb-1 md:mb-2 leading-tight">Day {currentDayData.day}: {currentDayData.title}</h1>
                    <p className="text-gray-500 text-xs md:text-sm font-medium">Explore the best spots seamlessly curated for you.</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itinerary.destination)}`, '_blank')}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Map size={14} /> Map view
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Download size={14} /> Print / Save
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[52px] md:left-[88px] top-4 bottom-4 w-[2px] bg-purple-100/60 border-l border-dashed border-purple-200/80"></div>
                  
                  <div className="space-y-5 md:space-y-12">
                    {currentDayData.activities.map((item, index) => {
                      const tagInfo = getTagForActivity(item.title, item.description);
                      const actImage = getActivityImage(item.title, item.description, index);
                      
                      return (
                        <motion.div 
                          custom={index}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          key={index} 
                          className="relative flex items-start gap-3 md:gap-12"
                        >
                          {/* Time */}
                          <div className="w-[40px] md:w-[64px] shrink-0 pt-0.5 md:pt-1">
                            <span className="text-[11px] md:text-sm font-bold text-gray-900">{item.time}</span>
                          </div>

                          {/* Timeline Node */}
                          <div className="relative flex-shrink-0 flex items-center justify-center pt-1 md:pt-2 w-3 md:w-4">
                            <div className="absolute z-10 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#5538EE] ring-4 md:ring-[6px] ring-[#F4F0FF] shadow-sm"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pb-2 md:pb-4">
                            <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-between">
                              <div className="pt-0 md:pt-1 max-w-lg min-w-0">
                                <div className="flex items-start gap-2 md:gap-3 mb-1 md:mb-2">
                                  <h3 className="text-sm md:text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wide whitespace-nowrap shrink-0 mt-0.5 ${tagInfo.color}`}>
                                    {tagInfo.tag}
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                                  {item.description}
                                </p>
                              </div>

                              {/* Activity Image */}
                              <div className="shrink-0 w-full md:w-56 h-24 md:h-32 rounded-xl md:rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                                <img 
                                  src={actImage} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom AI Assistant CTA */}
                <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Want to change something?</h4>
                      <p className="text-xs text-gray-500 font-medium">Ask Waylo to adjust this day or find new recommendations.</p>
                    </div>
                  </div>
                  <Link to="/assistant" className="w-full sm:w-auto shrink-0">
                    <button className="w-full bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                      <Sparkles size={16} /> Ask Waylo
                    </button>
                  </Link>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </motion.main>
  );
}
