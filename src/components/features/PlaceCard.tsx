import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { Place } from '../../types';
import { cardHover } from '../../lib/motion';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  // Using generic placeholder service until Unsplash is wired up
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    place.imageQuery
  )}?width=600&height=400&nologo=true`;

  return (
    <motion.article
      variants={cardHover}
      whileHover="hover"
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden bg-[#e5e3dd]">
        <img
          src={imageUrl}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-text text-xs px-3 py-1 rounded-full font-medium shadow-sm">
          {place.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-instrument-serif text-2xl text-text mb-2">
          {place.name}
        </h4>
        <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
          {place.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-medium text-accent uppercase tracking-wider">
          <MapPin size={14} />
          <span>Must See</span>
        </div>
      </div>
    </motion.article>
  );
}
