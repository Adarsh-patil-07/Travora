import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import type { Itinerary } from '../../types';
import { staggerContainer, fadeInUp } from '../../lib/motion';

interface ItineraryTimelineProps {
  itinerary: Itinerary;
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h2 className="font-instrument-serif text-4xl md:text-5xl text-text mb-4">
          Your {itinerary.duration} in {itinerary.destination}
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted uppercase tracking-wider text-xs font-semibold">
          <MapPin size={14} />
          AI-Curated Itinerary
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-12"
      >
        {itinerary.days.map((dayData, index) => (
          <motion.div
            key={`day-${dayData.day}-${index}`}
            variants={fadeInUp}
            className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-sm"
          >
            <div className="border-b border-border pb-6 mb-8">
              <span className="text-accent font-semibold tracking-widest text-sm uppercase mb-2 block">
                Day {dayData.day}
              </span>
              <h3 className="font-instrument-serif text-3xl text-text">
                {dayData.title}
              </h3>
            </div>

            <div className="relative border-l-2 border-border ml-3 md:ml-6 space-y-10 py-2">
              {dayData.activities.map((activity, actIndex) => (
                <div key={`act-${actIndex}`} className="relative pl-8 md:pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-accent" />
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-baseline mb-2">
                    <div className="flex items-center gap-2 text-accent font-medium text-sm whitespace-nowrap">
                      <Clock size={14} />
                      {activity.time}
                    </div>
                    <h4 className="text-xl font-medium text-text">
                      {activity.title}
                    </h4>
                  </div>
                  
                  <p className="text-muted leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
