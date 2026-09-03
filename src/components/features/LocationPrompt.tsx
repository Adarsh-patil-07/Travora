import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { searchLocation, type GeocodingResult } from '../../services/geocoding';
import WeatherWidget from './WeatherWidget';
import Button from '../ui/Button';
import { fadeInUp } from '../../lib/motion';

export default function LocationPrompt() {
  const { status, coordinates, requestLocation, setCoordinates, setStatus } = useGeolocation();
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [resolvedLocationName, setResolvedLocationName] = useState<string>('Your Location');
  
  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const handleSelectLocation = (result: GeocodingResult) => {
    setCoordinates({ lat: result.lat, lng: result.lon });
    setResolvedLocationName(result.name);
    setStatus('success');
    setIsManualSearch(false);
  };

  const handleEnableManualSearch = () => {
    setIsManualSearch(true);
    setStatus('idle');
  };

  // If we have coordinates (either via GPS or manual search), show the weather!
  if (status === 'success' && coordinates) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <WeatherWidget 
          lat={coordinates.lat} 
          lng={coordinates.lng} 
          locationName={resolvedLocationName} 
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-12">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-surface border border-border rounded-3xl p-8 md:p-12 text-center shadow-sm"
      >
        <AnimatePresence mode="wait">
          
          {/* MANUAL SEARCH STATE */}
          {isManualSearch || status === 'denied' ? (
            <motion.div
              key="manual-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="font-instrument-serif text-3xl md:text-4xl text-text mb-3">
                Where are you?
              </h2>
              <p className="text-muted mb-8 max-w-md">
                Search for your city to see your local weather and discover destinations nearby.
              </p>
              
              <div className="w-full max-w-md relative text-left">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-primary rounded-2xl border-none focus:ring-2 focus:ring-accent outline-none text-text transition-shadow"
                    autoFocus
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-lg overflow-hidden z-20">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectLocation(result)}
                        className="w-full text-left px-5 py-3 hover:bg-primary transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
                      >
                        <MapPin className="w-4 h-4 text-muted flex-shrink-0" />
                        <span className="text-text font-medium text-sm truncate">
                          {result.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            
            /* INITIAL / LOADING PROMPT STATE */
            <motion.div
              key="auto-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <Navigation className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="font-instrument-serif text-3xl md:text-4xl text-text mb-3">
                Local awareness.
              </h2>
              <p className="text-muted mb-8 max-w-md">
                Enable location services to see your current weather and discover perfectly tailored trips from where you are right now.
              </p>
              
              <div className="flex flex-col w-full max-w-xs gap-3">
                <Button 
                  variant="primary" 
                  onClick={requestLocation}
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Locating...
                    </>
                  ) : (
                    'Use my location'
                  )}
                </Button>
                
                <button
                  onClick={handleEnableManualSearch}
                  disabled={status === 'loading'}
                  className="text-sm font-medium text-muted hover:text-text transition-colors py-2"
                >
                  Search manually instead
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
