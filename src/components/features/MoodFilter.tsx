import { Link } from 'react-router-dom';
import { Mountain, Umbrella, Building2, Trees, Utensils, MapPin } from 'lucide-react';

const moods = [
  { name: 'Adventure', icon: Mountain },
  { name: 'Beach', icon: Umbrella },
  { name: 'Culture', icon: Building2 },
  { name: 'Nature', icon: Trees },
  { name: 'Food', icon: Utensils },
  { name: 'City', icon: MapPin },
];

export default function MoodFilter() {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-6">
        EXPLORE BY MOOD
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <Link
              key={mood.name}
              to={`/explore?tag=${mood.name.toLowerCase()}`}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-[#E5E3DD] transition-all hover:border-[#E07A3A] hover:shadow-lg group"
            >
              <Icon className="w-8 h-8 text-[#111111] group-hover:text-[#E07A3A] transition-colors" strokeWidth={1.5} />
              <span className="font-medium text-[#111111]">
                {mood.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
