import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
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

  // Generate a random rating between 4.5 and 4.9 for the mockup look
  const mockRating = (4.5 + Math.random() * 0.4).toFixed(1);

  return (
    <Link to={`/destination/${destination.id}`} className="block h-full w-full">
      <motion.div
        variants={cardHover}
        whileHover="hover"
        className="group relative flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow h-full w-full"
      >
        <img
          src={imageUrl}
          alt={destination.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-white">
          <h3 className="font-instrument-serif text-xl md:text-2xl mb-1 leading-tight">{destination.name}, {destination.country}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 opacity-90">
              <MapPin size={12} className="md:w-3.5 md:h-3.5" />
              <span className="text-[10px] md:text-xs font-medium tracking-wide capitalize">{destination.tags[0]}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-white/10">
              <Star size={10} className="fill-accent text-accent md:w-3 md:h-3" />
              <span className="text-[10px] md:text-xs font-semibold">{mockRating}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
