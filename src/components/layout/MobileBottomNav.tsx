import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function MobileBottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect virtual keyboard via visualViewport API
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const keyboardOpen = viewport.height < window.innerHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
    };

    viewport.addEventListener('resize', handleResize);
    viewport.addEventListener('scroll', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
      viewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Hide bottom nav when keyboard is open on mobile
  if (isKeyboardOpen) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E3DD] z-[60] px-1 pt-1.5 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = path === item.path || (item.path !== '/' && path.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-[4.5rem] gap-0.5 p-1 rounded-xl transition-all ${
                isActive ? 'text-accent' : 'text-[#999999] hover:text-[#666666]'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-accent/10' : 'bg-transparent'}`}>
                {item.name === 'Profile' && user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className={`w-[22px] h-[22px] rounded-full object-cover ${isActive ? 'ring-2 ring-accent ring-offset-1' : ''}`} />
                ) : (
                  <Icon size={22} className={isActive ? 'stroke-accent stroke-[2.5px]' : 'stroke-[1.75px]'} />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-accent' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
