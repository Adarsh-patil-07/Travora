import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X, Navigation } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Destinations', to: '/explore' },
  { label: 'Trip Planner', to: '/planner' },
  { label: 'AI Assistant', to: '/assistant' },
] as const;

// Smooth fade and slide animation for the menu overlay
const menuVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.3, ease: 'easeIn' as const } }
};

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    x: 0, 
    transition: { delay: 0.2 + i * 0.08, duration: 0.5, ease: 'easeOut' as const }
  })
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[60] flex flex-col bg-[#111111] text-white overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 shrink-0">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <Navigation className="text-accent fill-accent -rotate-45" size={20} />
              <span className="text-sm font-bold tracking-widest uppercase text-white">Travora</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-2 text-white hover:text-accent transition-colors duration-200 rounded-full"
              aria-label="Close menu"
            >
              <X size={28} strokeWidth={1} />
            </button>
          </div>

          {/* Left-aligned cinematic navigation links */}
          <nav className="flex flex-1 flex-col justify-center items-start px-8 gap-6 md:gap-8">
            {NAV_LINKS.map(({ label, to }, i) => {
              let isActive = false;
              if (label === 'Home') {
                isActive = location.pathname === '/';
              } else if (label === 'Destinations') {
                isActive = location.pathname.startsWith('/destination');
              } else {
                isActive = location.pathname.startsWith(to);
              }
              
              return (
                <motion.div custom={i} variants={linkVariants} initial="hidden" animate="visible" key={label}>
                  <Link
                    to={to}
                    onClick={onClose}
                    className={`font-instrument-serif text-5xl sm:text-6xl tracking-tight transition-colors duration-300 block ${
                      isActive 
                        ? 'text-accent' 
                        : 'text-white hover:text-accent'
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer branding */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="px-8 py-8 border-t border-white/10 shrink-0"
          >
            <p className="text-white/60 text-sm font-medium leading-relaxed">
              Discover places<br />
              worth remembering.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
