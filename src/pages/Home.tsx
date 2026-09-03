import { motion } from 'framer-motion';
import { CloudSun, MapPin, Wand2, MessageSquare } from 'lucide-react';
import { pageTransition, fadeInUp, staggerContainer } from '../lib/motion';
import Hero from '../components/features/Hero';
import DestinationCard from '../components/features/DestinationCard';
import { destinations } from '../data/destinations';

export default function Home() {
  // Grab all destinations to show directly on the page
  const trendingDestinations = destinations;

  const features = [
    {
      icon: <CloudSun size={24} className="text-blue-500" />,
      title: "Real-time Weather",
      subtitle: "Live weather updates for any destination",
      bg: "bg-blue-50"
    },
    {
      icon: <MapPin size={24} className="text-green-600" />,
      title: "Curated Places",
      subtitle: "Handpicked places worth visiting",
      bg: "bg-green-50"
    },
    {
      icon: <Wand2 size={24} className="text-purple-500" />,
      title: "AI Trip Planner",
      subtitle: "Plan personalized trips in seconds",
      bg: "bg-purple-50"
    },
    {
      icon: <MessageSquare size={24} className="text-accent" />,
      title: "Travel Assistant",
      subtitle: "Get answers to anything about your trip",
      bg: "bg-orange-50"
    }
  ];

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen flex flex-col bg-[#FAFAF7] overflow-x-hidden"
    >
      <div className="min-h-[100dvh] flex-shrink-0 w-full relative">
        <Hero />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-16 lg:gap-24 mx-auto max-w-[1920px] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 w-full py-16 lg:py-24">
        
        {/* Trending Destinations Section */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-2">
              <div>
                <div className="flex items-center gap-2 mb-2 lg:mb-3">
                  <h2 className="text-xs lg:text-sm font-bold uppercase tracking-widest text-text-muted">
                    Explore the World
                  </h2>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text">
                  All Destinations
                </h3>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
              {trendingDestinations.slice(0, 12).map((dest) => (
                <motion.div key={dest.id} variants={fadeInUp} className="h-[280px] lg:h-[340px] xl:h-[360px]">
                  <DestinationCard destination={dest} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Row */}
        <section>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-2xs">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.bg}`}>
                  <div className="scale-75">
                    {feature.icon}
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-text text-xs sm:text-sm mb-0.5">{feature.title}</h4>
                  <p className="text-[9px] sm:text-[10px] text-muted leading-tight max-w-[140px]">{feature.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
      </div>
    </motion.main>
  );
}
