import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ScrollToTop from './components/layout/ScrollToTop';
import ChatAssistant from './components/features/ChatAssistant';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Destination from './pages/Destination';
import Assistant from './pages/Assistant';
import Planner from './pages/Planner';
import Profile from './pages/Profile';

import { Toaster } from 'react-hot-toast';

/* ===== Animated Routes Wrapper ===== */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/destination/:id" element={<Destination />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ===== Layout Wrapper ===== */
function MainLayout() {
  const location = useLocation();
  const isAssistant = location.pathname === '/assistant';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-primary text-text w-full overflow-x-hidden">
      {/* Accessibility: Skip to main content */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Global Navigation */}
      <Navbar />

      {/* Page Content */}
      <div id="main-content" className={`flex-1 flex flex-col w-full ${isAssistant ? 'h-screen overflow-hidden' : ''}`}>
        <AnimatedRoutes />
      </div>

      {/* Global Elements */}
      {location.pathname === '/profile' && <Footer />}
      {!isAssistant && <ChatAssistant />}
      <MobileBottomNav />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#222222',
            color: '#fff',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            marginBottom: '80px',
          },
          duration: 4000,
        }}
      />
    </div>
  );
}

/* ===== Main App ===== */
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
