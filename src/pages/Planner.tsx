import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Map, Download, Edit2, Sparkles, ArrowRight, Navigation
} from 'lucide-react';
import { pageTransition, fadeInUp } from '../lib/motion';
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

export default function Planner() {
  const location = useLocation();
  const itinerary: Itinerary | undefined = location.state?.itineraryData;
  const [activeDay, setActiveDay] = useState(1);

  if (!itinerary) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4 } }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#FDFCFE] pt-20 md:pt-32 pb-[80px] md:pb-20 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-600 shadow-sm border border-purple-100">
            <Map size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">No Trip Planned Yet</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Generate a custom, day-by-day itinerary by chatting with Waylo, your personal AI travel assistant.
          </p>
          <Link to="/assistant" className="bg-[#5538EE] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#4A2699] transition-colors flex items-center justify-center gap-2 mx-auto w-fit shadow-md hover:shadow-lg">
            <Sparkles size={18} /> Plan a Trip with AI
          </Link>
        </div>
      </motion.main>
    );
  }

  const currentDayData = itinerary.days.find(d => d.day === activeDay) || itinerary.days[0];
  
  // Hero image based on destination
  const fallbackHeroImages = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop'
  ];
  const hash = itinerary.destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const destImage = fallbackHeroImages[hash % fallbackHeroImages.length];

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FDFCFE] pt-24 pb-20"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Trip Summary Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Your Trip</h2>
              <div className="relative h-32 rounded-2xl overflow-hidden mb-5">
                <img 
                  src={destImage} 
                  alt={itinerary.destination} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{itinerary.destination}</h3>
                <p className="text-xs text-gray-500 font-medium mb-1">{itinerary.duration} • AI Planned</p>
                <p className="text-xs text-gray-500 font-medium">Personalized Itinerary</p>
              </div>
              <button className="w-full mt-5 py-2.5 flex items-center justify-center gap-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit2 size={14} /> Edit trip
              </button>
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
                  <button className="bg-white text-[#5538EE] text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
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
          <div className="flex-1">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-6 md:mb-10">
              <div>
                <h1 className="text-lg md:text-[28px] font-bold text-gray-900 mb-1 md:mb-2 leading-tight">Day {currentDayData.day}: {currentDayData.title}</h1>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Explore the best spots seamlessly curated for you.</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Map size={14} /> Map view
                </button>
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download size={14} /> Download
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
                  const genericImages = [
                    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop', // Travel map
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', // Beach
                    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop', // Restaurant
                    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop', // Architecture
                    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop', // Nature
                    'https://images.unsplash.com/photo-1533929736458-a5694d084b6e?q=80&w=800&auto=format&fit=crop', // Shopping/Street
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop', // Dining interior
                    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop', // Landmarks
                  ];
                  const actImage = genericImages[(index + currentDayData.day) % genericImages.length];
                  
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

                          {/* Image — smaller on mobile */}
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
                <button className="w-full bg-[#5538EE] hover:bg-[#4A2699] text-white rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Sparkles size={16} /> Ask Waylo
                </button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </motion.main>
  );
}
