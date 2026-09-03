import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/features/DestinationCard';
import EmptyState from '../components/ui/EmptyState';
import { pageTransition, staggerContainer, fadeInUp } from '../lib/motion';
import type { Continent, MoodTag } from '../types';

const CONTINENTS: Continent[] = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
const MOODS: MoodTag[] = ['adventure', 'beach', 'culture', 'nature', 'food', 'city'];

function CustomSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  icon: any;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || { label: placeholder, value: 'All' };

  return (
    <div className="relative w-full sm:w-48" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-4 pr-4 py-3 md:py-4 bg-primary rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-text transition-shadow text-sm md:text-base ${isOpen ? 'ring-2 ring-accent' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-muted" />
          <span className="capitalize font-medium">{selectedOption.label}</span>
        </div>
        <ChevronDown size={14} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E5E3DD] overflow-hidden py-2 z-50 max-h-[300px] overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 transition-colors flex items-center capitalize ${
                  value === opt.value
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 text-sm font-medium'
                }`}
              >
                {opt.label}
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
  
  // State from URL or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'All'>(
    (searchParams.get('continent') as Continent) || 'All'
  );
  const [selectedMood, setSelectedMood] = useState<MoodTag | 'All'>(
    (searchParams.get('tag') as MoodTag) || 'All'
  );

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
      className="min-h-screen bg-primary pt-16 md:pt-28 pb-20"
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-12 mt-2 md:mt-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-4">
            Explore the world.
          </h1>
          <p className="text-muted text-base md:text-lg max-w-2xl">
            Find your next adventure by searching destinations, filtering by region, or discovering places that match your current mood.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-surface p-4 md:p-6 rounded-3xl shadow-sm border border-border mb-8 md:mb-12 flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search destinations or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-primary rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-text transition-shadow text-sm md:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
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

        {/* Results Count */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs md:text-sm font-semibold text-muted uppercase tracking-wider">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'Destination' : 'Destinations'} Found
          </p>
        </div>

        {/* Results Grid */}
        {filteredDestinations.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
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
                  className="h-56 md:h-72"
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
            className="py-12"
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
                className="text-accent hover:text-accent-hover font-medium underline underline-offset-4 transition-colors"
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
