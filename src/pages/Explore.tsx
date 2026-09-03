import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Sparkles, ChevronDown, Check } from 'lucide-react';
import DestinationCard from '../components/features/DestinationCard';
import EmptyState from '../components/ui/EmptyState';
import { destinations } from '../data/destinations';
import type { Continent, MoodTag } from '../types';
import { pageTransition, staggerContainer, fadeInUp } from '../lib/motion';

const CONTINENTS: Continent[] = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
const MOODS: MoodTag[] = ['adventure', 'beach', 'culture', 'nature', 'food', 'city'];

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  placeholder: string;
}

function CustomSelect({ value, onChange, options, icon: Icon, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative flex-1 md:flex-initial md:min-w-[160px] lg:min-w-[185px]" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-1.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3.5 bg-[#FAFAF7] hover:bg-[#EFECE6] rounded-xl md:rounded-2xl border border-transparent transition-all text-xs md:text-sm font-semibold text-[#111111] cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-1.5 md:gap-2 truncate">
          <Icon className="text-gray-400 shrink-0 w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-1.5 max-h-60 overflow-y-auto no-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs md:text-sm text-left transition-colors cursor-pointer ${
                  value === option.value
                    ? 'bg-purple-50 text-[#5538EE] font-bold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                <span className="capitalize">{option.label}</span>
                {value === option.value && <Check size={14} className="text-[#5538EE] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const initialQuery = searchParams.get('q') || '';
  const initialContinent = (searchParams.get('continent') as Continent) || 'All';
  const initialMood = (searchParams.get('tag') as MoodTag) || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'All'>(initialContinent);
  const [selectedMood, setSelectedMood] = useState<MoodTag | 'All'>(initialMood);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedContinent !== 'All') params.set('continent', selectedContinent);
    if (selectedMood !== 'All') params.set('tag', selectedMood);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedContinent, selectedMood, setSearchParams]);

  // Filtering logic
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dest.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchContinent = selectedContinent === 'All' || dest.continent === selectedContinent;
      const matchMood = selectedMood === 'All' || dest.tags.includes(selectedMood);
      
      return matchSearch && matchContinent && matchMood;
    });
  }, [searchQuery, selectedContinent, selectedMood]);

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAFAF7] pt-20 md:pt-28 pb-24"
    >
      <div className="mx-auto max-w-[1920px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 w-full">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2 md:mb-3">
            Explore the world.
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Find your next adventure by searching destinations, filtering by region, or discovering places that match your travel vibe.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-gray-200/70 mb-8 md:mb-10 flex flex-col md:flex-row gap-2.5 md:gap-4 items-stretch">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3.5 md:left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search destinations or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-[#FAFAF7] rounded-xl md:rounded-2xl border-none focus:bg-white focus:ring-2 focus:ring-[#5538EE]/30 outline-none text-gray-900 placeholder:text-gray-400 transition-all text-xs md:text-sm font-medium"
            />
          </div>

          <div className="flex flex-row gap-2 md:gap-3 w-full md:w-auto">
            {/* Continent Filter */}
            <CustomSelect
              value={selectedContinent}
              onChange={(val) => setSelectedContinent(val as Continent | 'All')}
              icon={MapPin}
              placeholder="All Regions"
              options={[
                { label: 'All Regions', value: 'All' },
                ...CONTINENTS.map(c => ({ label: c, value: c }))
              ]}
            />

            {/* Mood Filter */}
            <CustomSelect
              value={selectedMood}
              onChange={(val) => setSelectedMood(val as MoodTag | 'All')}
              icon={Sparkles}
              placeholder="All Moods"
              options={[
                { label: 'All Moods', value: 'All' },
                ...MOODS.map(m => ({ label: m, value: m }))
              ]}
            />
          </div>
        </div>

        {/* Results Count Header */}
        <div className="mb-5 md:mb-7 flex items-center justify-between">
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'Destination' : 'Destinations'} Found
          </p>
        </div>

        {/* Results Grid - Exactly 4 in each row on Desktop with proper spacing */}
        {filteredDestinations.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((dest) => (
                <motion.div
                  layout
                  key={dest.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  className="h-72 sm:h-80 md:h-[340px]"
                >
                  <DestinationCard destination={dest} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <EmptyState 
              title="No destinations found"
              message="Try adjusting your search or clearing the filters to discover more places."
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedContinent('All');
                  setSelectedMood('All');
                }}
                className="bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
