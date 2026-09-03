import { useState, useEffect } from 'react';
import { fetchTravelImage, getTravelImageSync } from '../services/images';

/**
 * Custom hook to dynamically fetch and display travel images from Unsplash/Pexels.
 * Returns an instant synchronous cached image first, and updates asynchronously if a fresh image is fetched.
 */
export function useTravelImage(query: string, keyId?: string, fallbackUrl?: string, size: 'small' | 'large' = 'large') {
  const initial = getTravelImageSync(keyId || query, fallbackUrl, size);
  const [imageUrl, setImageUrl] = useState<string>(initial);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    async function load() {
      setLoading(true);
      try {
        const url = await fetchTravelImage(query, keyId, size);
        if (isMounted && url) {
          setImageUrl(url);
        }
      } catch (err) {
        console.warn('Failed to load image for', query, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [query, keyId, size]);

  return { imageUrl, loading };
}
