import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that scrolls the window to the top
 * whenever the route pathname changes.
 * Render once inside the Router — it returns no DOM.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
