import type { Variants } from 'framer-motion';

// Refined easing curve (similar to Apple's ease-out)
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Page transition variants - Removed Y translation to prevent layout jumps, added subtle scale
export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: premiumEase } },
};

// Fade in from below on scroll - reduced distance for a more elegant reveal
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

// Staggered children container - slightly faster staggering
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// Individual stagger item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

// Scale on hover for cards - very subtle and quick
export const cardHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

// Slide in from right (for mobile menu, chat panel)
export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
};

// Slide up from bottom (for mobile chat drawer)
export const slideUpDrawer: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { y: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
};

// Gentle bounce for scroll indicator
export const bounceAnimation = {
  y: [0, 8, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};
