import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function MobileBottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect virtual keyboard reliably across Android and iOS
  useEffect(() => {
    // Store the initial screen height when component mounts
    const initialHeight = window.innerHeight;

    const handleResize = () => {
      // Get the current height (prefer visualViewport if available)
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      
      // If current height is significantly less than the initial height (e.g., < 85%),
      // it means the virtual keyboard has pushed the viewport up.
      const keyboardOpen = currentHeight < initialHeight * 0.85;
      setIsKeyboardOpen(keyboardOpen);
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  // Hide bottom nav when keyboard is open on mobile
  if (isKeyboardOpen) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 sm:bottom-4 inset-x-4 sm:inset-x-8 max-w-sm mx-auto rounded-[22px] bg-white/60 hover:bg-white/70 backdrop-blur-2xl backdrop-saturate-200 border border-white/45 ring-1 ring-black/[0.04] z-[60] px-2 py-1 shadow-[0_12px_36px_-4px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-300">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-14 gap-0.5 py-0.5 rounded-full transition-all ${
                isActive ? 'text-[#A855F7]' : 'text-gray-700 hover:text-gray-950'
              }`}
            >
              <div className={`p-1 rounded-full transition-all ${isActive ? 'bg-[#A855F7]/15' : 'bg-transparent'}`}>
                {item.name === 'Profile' && user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className={`w-[20px] h-[20px] rounded-full object-cover ${isActive ? 'ring-2 ring-[#A855F7] ring-offset-1 ring-offset-white' : 'border border-gray-400'}`} />
                ) : (
                  <Icon size={19} className={isActive ? 'stroke-[#A855F7] stroke-[2.2px]' : 'stroke-gray-700 stroke-[1.85px]'} />
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'font-bold text-[#A855F7]' : 'font-semibold text-gray-700'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
