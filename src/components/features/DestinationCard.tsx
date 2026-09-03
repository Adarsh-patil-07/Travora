import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';
import type { Destination } from '../../types';
import { cardHover } from '../../lib/motion';

const destinationImages: Record<string, string> = {
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
  'cape-town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop',
  'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
  'istanbul': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  'vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=800&auto=format&fit=crop',
  'queenstown': 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop',
};

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
