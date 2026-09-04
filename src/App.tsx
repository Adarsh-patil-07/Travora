import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster, useToasterStore, toast } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ScrollToTop from './components/layout/ScrollToTop';
import ChatAssistant from './components/features/ChatAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Limit maximum toasts to prevent multiple popups
function ToastLimiter() {
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 1;

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Isolate toasts after the limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss them
  }, [toasts]);

  return null;
}

// Route-level Code Splitting for optimal initial page load speed
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Destination = lazy(() => import('./pages/Destination'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Planner = lazy(() => import('./pages/Planner'));
const Profile = lazy(() => import('./pages/Profile'));

/* ===== Route Loading Fallback ===== */
function PageLoader() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-purple-200 border-t-[#5538EE] animate-spin" />
    </div>
  );
}

/* ===== Animated Routes Wrapper ===== */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<Destination />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
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
      {location.pathname === '/' && <Footer />}
      {!isAssistant && <ChatAssistant />}
      <MobileBottomNav />
      <ToastLimiter />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#111111',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: '600',
            padding: '10px 22px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            marginBottom: '84px',
            letterSpacing: '0.01em',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
          duration: 3500,
        }}
      />
    </div>
  );
}

/* ===== Main App ===== */
export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <ScrollToTop />
            <MainLayout />
          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
