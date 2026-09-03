import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share, MapPin, Clock, Banknote, Languages, 
  Calendar, Users, Maximize, Map as MapIcon, ChevronRight,
  CheckCircle2, Lightbulb, Sparkles, Navigation
} from 'lucide-react';
import { destinations } from '../data/destinations';
import ErrorFallback from '../components/ui/ErrorFallback';
import Button from '../components/ui/Button';
import ItineraryTimeline from '../components/features/ItineraryTimeline';
import { generateItinerary } from '../services/ai';
import { pageTransition } from '../lib/motion';
import type { Place } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { saveDestinationToDb, removeDestinationFromDb } from '../lib/db';
import toast from 'react-hot-toast';

// Helper to get a flag emoji based on country name
const getFlagEmoji = (country: string) => {
  const flags: Record<string, string> = {
    'Japan': '🇯🇵', 'France': '🇫🇷', 'Indonesia': '🇮🇩', 'South Africa': '🇿🇦',
    'United States': '🇺🇸', 'Australia': '🇦🇺', 'Switzerland': '🇨🇭', 'UAE': '🇦🇪',
    'United Kingdom': '🇬🇧', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Turkey': '🇹🇷',
    'Canada': '🇨🇦', 'New Zealand': '🇳🇿', 'Singapore': '🇸🇬'
  };
  return flags[country] || '🌍';
};

export const destinationImages: Record<string, string> = {
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2560&auto=format&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2560&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2560&auto=format&fit=crop',
  'cape-town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2560&auto=format&fit=crop',
  'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2560&auto=format&fit=crop',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2560&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2560&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2560&auto=format&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2560&auto=format&fit=crop',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2560&auto=format&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2560&auto=format&fit=crop',
  'istanbul': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2560&auto=format&fit=crop',
  'vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=2560&auto=format&fit=crop',
  'queenstown': 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2560&auto=format&fit=crop',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2560&auto=format&fit=crop',
};

// Local component for the mockup-style place cards
function MockupPlaceCard({ place }: { place: Place }) {
  const [isSaved, setIsSaved] = useState(false);
  
  const fallbackImages = [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop', // Rome
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', // Kyoto Temple
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop', // Paris Louvre
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop', // Istanbul
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop', // Queenstown
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop', // Central Park
    'https://images.unsplash.com/photo-1533929736458-a5694d084b6e?q=80&w=800&auto=format&fit=crop', // Market
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop', // Beach
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop', // Adventure
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop', // Bali
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop', // Cape Town
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop', // Sydney
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', // Dubai
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop'  // London
  ];
  
  const hash = place.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = place.imageUrl || fallbackImages[hash % fallbackImages.length];
  
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm group hover:shadow-md transition-all">
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img src={imageUrl} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <button 
          onClick={() => {
            if (isSaved) {
              setIsSaved(false);
              toast.success('Removed from favorites');
            } else {
              setIsSaved(true);
              toast.success('Added to favorites!');
            }
          }}
          className={`absolute top-3 right-3 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-10 ${
            isSaved ? 'bg-accent text-white hover:bg-accent/90' : 'bg-black/20 text-white hover:bg-black/40'
          }`}
        >
          <Heart size={14} className={isSaved ? 'fill-white' : ''} />
        </button>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{place.name}</h4>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{place.description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
          <MapPin size={12} />
          <span>{place.category}</span>
        </div>
      </div>
    </div>
  );
}

export default function Destination() {
  const { id } = useParams<{ id: string }>();
  const dest = destinations.find((d) => d.id === id);
  const { user, userData, refreshUserData } = useAuth();
  const isSaved = userData?.savedDestinations.includes(dest?.id || '') || false;

  // States for AI Itinerary generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary] = useState<any>(null);
  const navigate = useNavigate();

  if (!dest) {
    return <ErrorFallback message="Destination not found" />;
  }

  const handlePlanTrip = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('Generating custom itinerary...');
    try {
      const data = await generateItinerary(dest.name, 3, 'must-see');
      toast.success('Itinerary generated!', { id: loadingToast });
      navigate('/planner', { state: { itineraryData: data } });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate itinerary. Please try again.', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const bgImageUrl = destinationImages[dest.id] || `https://image.pollinations.ai/prompt/${encodeURIComponent(dest.imageQuery)}?width=2560&height=1440&nologo=true`;
  const cherryBlossomUrl = bgImageUrl;

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#F8F9FA] pb-24 font-sans"
    >
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] md:min-h-[85vh] lg:h-[85vh] w-full bg-[#111111] overflow-hidden flex flex-col">
        <div className="absolute inset-0">
          <img src={bgImageUrl} alt={dest.name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-12 xl:px-16 w-full flex-1 flex flex-col justify-center pt-24 pb-16 md:pb-24">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12 h-full">
            
            {/* Hero Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm mb-4 md:mb-6 font-medium">
                <Link to="/" className="hover:text-white">Home</Link>
                <ChevronRight size={14} />
                <Link to="/explore" className="hover:text-white">Destinations</Link>
                <ChevronRight size={14} />
                <span className="text-white font-semibold truncate">{dest.name}</span>
              </div>

              <h1 className="font-instrument-serif text-white text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] leading-none mb-3 md:mb-4 tracking-tight">
                {dest.name}
              </h1>
              
              <div className="flex items-center gap-2 text-white text-lg sm:text-xl md:text-2xl font-medium mb-4 md:mb-6">
                <span>{getFlagEmoji(dest.country)}</span>
                <span>{dest.country}</span>
              </div>
              
              <p className="text-white/90 text-base sm:text-lg md:text-xl font-light max-w-md mb-6 md:mb-8 leading-relaxed">
                {dest.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full sm:w-auto">
                <button 
                  onClick={async () => {
                    if (!user) {
                      toast.error('Please sign in from the Profile page to save destinations.');
                      return;
                    }
                    if (isSaved) {
                      await removeDestinationFromDb(user.uid, dest.id);
                      toast.success('Removed from favorites');
                    } else {
                      await saveDestinationToDb(user.uid, dest.id);
                      toast.success('Added to favorites!');
                    }
                    await refreshUserData();
                  }}
                  className={`flex-1 sm:flex-none px-5 py-3 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium flex items-center justify-center gap-2 transition-colors ${
                    isSaved ? 'bg-accent text-white hover:bg-accent/90' : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} className={isSaved ? 'fill-white' : ''} />
                  {isSaved ? 'Saved to favorites' : 'Add to favorites'}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="flex-1 sm:flex-none bg-black/30 backdrop-blur-md border border-white/30 text-white px-5 py-3 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium flex items-center justify-center gap-2 hover:bg-black/50 transition-colors"
                >
                  <Share size={18} />
                  Share
                </button>
              </div>
            </div>

            {/* Hero Right Content - Weather */}
            <div id="weather" className="hidden lg:flex w-full lg:w-1/2 justify-end items-center scroll-mt-32">
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white shadow-2xl w-80">
                <div className="flex items-center gap-2 mb-6 text-white/80 text-sm font-medium">
                  <MapPin size={16} />
                  <span>Current weather in {dest.name}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-accent text-5xl">☀️</div>
                  <div>
                    <div className="text-5xl font-light tracking-tighter">26<span className="text-3xl align-top">°C</span></div>
                    <div className="text-sm font-medium">Sunny</div>
                    <div className="text-xs text-white/70">Feels like 28°</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4 pb-4 text-xs">
                  <div>
                    <div className="text-white/70 mb-1">Humidity</div>
                    <div className="font-medium">52%</div>
                  </div>
                  <div>
                    <div className="text-white/70 mb-1">Wind</div>
                    <div className="font-medium">12 km/h</div>
                  </div>
                  <div>
                    <div className="text-white/70 mb-1">Visibility</div>
                    <div className="font-medium">10 km</div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 flex justify-between items-center text-xs font-medium text-white/90 cursor-pointer hover:text-white group">
                  <span>View full forecast</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Bottom Info Bar (Hidden on Mobile to save space and remove scroll) */}
        <div className="hidden md:block absolute bottom-6 md:bottom-12 left-0 right-0 w-full">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex items-center justify-between border-t border-white/20 pt-4 md:pt-6 text-white/80 text-xs md:text-sm font-medium gap-8">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="flex items-center gap-2"><MapPin size={16} className="flex-shrink-0" /> {dest.coordinates.lat}° N, {dest.coordinates.lng}° E</div>
                <div className="flex items-center gap-2"><Clock size={16} className="flex-shrink-0" /> Local Time</div>
                <div className="flex items-center gap-2"><Banknote size={16} className="flex-shrink-0" /> Local Currency</div>
                <div className="flex items-center gap-2"><Languages size={16} className="flex-shrink-0" /> Primary Language</div>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${dest.coordinates.lat},${dest.coordinates.lng}`, '_blank')}
                className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <MapIcon size={16} /> View on map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY TABS */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-20 shadow-sm border-b border-gray-100 sticky top-[72px] lg:top-[76px]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <ul className="flex gap-8 overflow-x-auto text-base font-semibold text-gray-500 py-4 pb-3">
            <li onClick={() => window.document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Overview</li>
            <li onClick={() => window.document.getElementById('places')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Places to visit</li>
            <li onClick={() => window.document.getElementById('things')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Things to do</li>
            <li onClick={() => window.document.getElementById('weather')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Weather</li>
            <li onClick={() => window.document.getElementById('best-time')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Best time to visit</li>
            <li onClick={() => window.document.getElementById('tips')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Travel tips</li>
            <li onClick={() => window.document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer">Itinerary</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 flex flex-col gap-12">
        
        {/* 3. OVERVIEW & BEST TIME TO VISIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* About */}
          <div id="overview" className="scroll-mt-32 lg:col-span-7 xl:col-span-8 flex flex-col h-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-instrument-serif tracking-tight">About {dest.name}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {dest.description} {dest.name}'s bustling capital fuses cutting-edge technology with deep-rooted traditions. From neon-lit skyscrapers and world-class shopping to serene temples and exquisite cuisine, {dest.name} offers an unforgettable experience.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Whether you're exploring the historic districts, tasting local delicacies at vibrant street markets, or enjoying the lively nightlife, every moment spent here is packed with unique discoveries. Discover the true essence of {dest.country} as you immerse yourself in the rich local culture.
            </p>
            
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-8 mt-auto pt-4">
              <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-gray-400 mr-2 lg:mr-4">Known For:</span>
              {['Rich Culture', 'Local Cuisine', 'Historic Sites', 'Vibrant Nightlife', 'Scenic Views'].map((tag, i) => (
                <span key={i} className="px-4 py-1.5 lg:px-5 lg:py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:border-gray-200 hover:bg-gray-100 transition-colors cursor-default shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2 lg:mb-3 text-xs font-bold uppercase tracking-widest"><Users size={16}/> Population</div>
                <div className="font-bold text-gray-900 text-lg lg:text-xl">13.5M+</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2 lg:mb-3 text-xs font-bold uppercase tracking-widest"><Maximize size={16}/> Area</div>
                <div className="font-bold text-gray-900 text-lg lg:text-xl">2,194 km²</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2 lg:mb-3 text-xs font-bold uppercase tracking-widest"><MapIcon size={16}/> Elevation</div>
                <div className="font-bold text-gray-900 text-lg lg:text-xl">40 m</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2 lg:mb-3 text-xs font-bold uppercase tracking-widest"><Clock size={16}/> To explore</div>
                <div className="font-bold text-gray-900 text-lg lg:text-xl">3 - 5 days</div>
              </div>
            </div>
          </div>
          
          {/* Best time to visit */}
          <div id="best-time" className="bg-gradient-to-br from-[#F0F4FF] to-blue-50/50 rounded-3xl p-6 md:p-8 border border-blue-100 shadow-sm scroll-mt-32 lg:col-span-5 xl:col-span-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold mb-4">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="text-xl">Best time to visit</h3>
            </div>
            <p className="text-blue-900/80 mb-8 text-sm leading-relaxed">
              {dest.bestTimeToVisit} offer the most pleasant weather and beautiful scenery for exploring the city and its surroundings.
            </p>
            <div className="relative h-48 md:h-56 lg:h-48 xl:h-64 rounded-2xl overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
              <img src={cherryBlossomUrl} alt="Best time to visit scenery" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* 4. PLACES TO VISIT */}
        <div id="places" className="scroll-mt-32">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-instrument-serif tracking-tight">Places to visit</h2>
            <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
              View all places <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-8">
            {dest.famousPlaces.map((place, i) => (
              <MockupPlaceCard key={i} place={place} />
            ))}
          </div>
        </div>

        {/* 5. THINGS TO DO & TRAVEL TIPS & AI BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Things to do */}
          <div id="things" className="md:col-span-1 scroll-mt-32">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Things to do</h2>
              <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:text-blue-700">
                View all <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 shadow-sm">
                <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"><MapIcon size={20}/></div>
                <div><h4 className="font-bold text-sm text-gray-900 mb-1">Explore neighborhoods</h4><p className="text-xs text-gray-500 leading-tight">Shinjuku, Harajuku, Ginza and more.</p></div>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 shadow-sm">
                <div className="bg-yellow-50 text-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"><Banknote size={20}/></div>
                <div><h4 className="font-bold text-sm text-gray-900 mb-1">Food experiences</h4><p className="text-xs text-gray-500 leading-tight">Sushi, Ramen, Street food and local cafes.</p></div>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-4 shadow-sm">
                <div className="bg-pink-50 text-pink-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"><Heart size={20}/></div>
                <div><h4 className="font-bold text-sm text-gray-900 mb-1">Shopping</h4><p className="text-xs text-gray-500 leading-tight">From luxury brands to unique local finds.</p></div>
              </div>
            </div>
          </div>

          {/* Travel Tips */}
          <div id="tips" className="md:col-span-1 scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 opacity-0">Spacing</h2>
            <div className="bg-[#FFF9EA] rounded-3xl p-6 border border-yellow-100 h-[calc(100%-3rem)]">
              <div className="flex items-center gap-2 text-yellow-800 font-bold mb-6">
                <Lightbulb size={20} className="fill-yellow-500 text-yellow-500" />
                <h3 className="text-lg">Travel tips</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Get a Suica or Pasmo card for easy travel.",
                  "Most places accept cards, but carry some cash.",
                  "Respect local customs at temples and shrines.",
                  "Try visiting early morning to avoid crowds."
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-yellow-900/80">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Banner */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 opacity-0 hidden md:block">Spacing</h2>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm h-full md:h-[calc(100%-3rem)] flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Need help planning?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Ask Waylo, your AI travel companion, for personalized recommendations and itineraries.
              </p>
              <Link to="/assistant" className="mt-auto group">
                <div className="rounded-xl p-[2px] border-2 border-accent transition-colors duration-300">
                  <div className="bg-[#111111] text-white rounded-lg py-3.5 px-6 w-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md">
                    <Sparkles size={18} />
                    Chat with Waylo
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 6. BOTTOM PLANNER BANNER */}
        <div id="itinerary" className="bg-gradient-to-r from-[#F0F4FF] to-[#F5EEFF] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-100 scroll-mt-32">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg flex-shrink-0">
              <Navigation className="text-white w-8 h-8 -rotate-12" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to plan your trip to {dest.name}?</h3>
              <p className="text-gray-600">Let Waylo craft the perfect itinerary for you.</p>
            </div>
          </div>
          <Button 
            onClick={handlePlanTrip} 
            disabled={isGenerating}
            className="w-full md:w-auto bg-[#7B5EE4] hover:bg-[#684ACD] text-white whitespace-nowrap shadow-md shadow-purple-500/20"
          >
            {isGenerating ? 'Generating...' : (
              <span className="flex items-center gap-2"><Sparkles size={18} /> Plan my trip</span>
            )}
          </Button>
        </div>

        {/* Generated Itinerary Display */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <h2 className="font-instrument-serif text-4xl text-gray-900 mb-8">Your Custom Itinerary</h2>
              <ItineraryTimeline itinerary={itinerary} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.main>
  );
}
