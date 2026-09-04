import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';
import type { Destination } from '../../types';
import { cardHover } from '../../lib/motion';
import { useTravelImage } from '../../hooks/useTravelImage';
import { useAuth } from '../../contexts/AuthContext';
import { saveDestinationToDb, removeDestinationFromDb } from '../../lib/db';
import toast from 'react-hot-toast';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { imageUrl } = useTravelImage(destination.imageQuery || `${destination.name} ${destination.country}`, destination.id, undefined, 'small');
  const { user, userData, refreshUserData } = useAuth();
  
  const isSaved = userData?.savedDestinations.includes(destination.id) || false;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to save destinations.');
      return;
    }

    if (isSaved) {
      await removeDestinationFromDb(user.uid, destination.id);
      toast.success('Removed from favorites');
    } else {
      await saveDestinationToDb(user.uid, destination.id);
      toast.success('Added to favorites!');
    }
    await refreshUserData();
  };

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
          
          <div 
            onClick={handleFavoriteClick}
            className="flex items-center justify-center bg-white/15 backdrop-blur-md w-7 h-7 rounded-full border border-white/25 text-white shadow-xs cursor-pointer pointer-events-auto hover:bg-white/30 transition-colors"
          >
            <Heart size={14} className={isSaved ? 'fill-accent text-accent' : 'text-white'} />
          </div>
        </div>

        {/* Bottom Destination Info */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex items-end justify-between pointer-events-none">
          <div className="min-w-0 pr-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-0.5 truncate leading-tight group-hover:text-amber-200 transition-colors">
              {destination.name}
            </h3>
            <p className="text-white/80 text-xs flex items-center gap-1 font-medium truncate">
              <MapPin size={12} className="shrink-0 text-amber-400" /> {destination.country}
            </p>
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
