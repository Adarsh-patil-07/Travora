import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';
import type { Destination } from '../../types';
import { cardHover } from '../../lib/motion';
import { destinationImages } from '../../data/destinations';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const fallbackList = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'
  ];
  const hash = destination.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = destinationImages[destination.id] || fallbackList[hash % fallbackList.length];

  // Static mock ratings based on destination ID hash
  const rating = (4.6 + (hash % 4) * 0.1).toFixed(1);

  return (
    <Link to={`/destination/${destination.id}`} className="block h-full w-full group">
      <motion.div
        variants={cardHover}
        whileHover="hover"
        className="relative flex flex-col rounded-[26px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-full w-full border border-black/5 bg-gray-100"
      >
        {/* Destination Photo */}
        <img
          src={imageUrl}
          alt={destination.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Premium Multi-Stop Gradient Overlay for Rich Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-45% to-transparent pointer-events-none" />
        
        {/* Transparent Glass Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          <span className="bg-white/15 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/25 capitalize tracking-wide shadow-xs">
            {destination.tags[0] || 'Explore'}
          </span>
          
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/25 text-white shadow-xs">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] sm:text-[11px] font-bold">{rating}</span>
          </div>
        </div>

        {/* Bottom Destination Info */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex items-end justify-between">
          <div className="min-w-0 pr-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-0.5 truncate leading-tight group-hover:text-amber-200 transition-colors">
              {destination.name}
            </h3>
            <p className="text-white/80 text-xs flex items-center gap-1 font-medium truncate">
              <MapPin size={12} className="shrink-0 text-amber-400" /> {destination.country}
            </p>
          </div>

          {/* Hover Arrow Action */}
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-gray-900 group-hover:scale-105 transition-all duration-300 shadow-sm">
            <ArrowUpRight size={15} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
