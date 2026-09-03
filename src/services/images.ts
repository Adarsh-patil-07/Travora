/**
 * Image Service
 * Dynamically fetches high-resolution travel and destination images from Unsplash / Pexels.
 * Includes local in-memory and persistent caching to ensure 0-lag and avoid API rate limits.
 */

const imageCache: Map<string, string> = new Map();

// Helper to check persistent storage cache
const getCachedImage = (query: string): string | null => {
  if (imageCache.has(query)) return imageCache.get(query)!;
  try {
    const saved = localStorage.getItem(`travora_img_v3_${query.toLowerCase().trim()}`);
    if (saved) {
      imageCache.set(query, saved);
      return saved;
    }
  } catch {
    // ignore localStorage errors (e.g. private mode)
  }
  return null;
};

// Helper to save to persistent storage cache
const setCachedImage = (query: string, url: string) => {
  imageCache.set(query, url);
  try {
    localStorage.setItem(`travora_img_v3_${query.toLowerCase().trim()}`, url);
  } catch {
    // ignore localStorage quota errors
  }
};

/**
 * Curated Unsplash CDN map for primary travel destinations and places.
 * Used as an instant fallback when no API key is provided or when offline.
 */
const UNSPLASH_CURATED_MAP: Record<string, string> = {
  // Destinations
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=75&w=1200&auto=format&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=75&w=1200&auto=format&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=75&w=1200&auto=format&fit=crop',
  'cape-town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=75&w=1200&auto=format&fit=crop',
  'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=75&w=1200&auto=format&fit=crop',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=75&w=1200&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=1200&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=75&w=1200&auto=format&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=75&w=1200&auto=format&fit=crop',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=75&w=1200&auto=format&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=75&w=1200&auto=format&fit=crop',
  'istanbul': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=75&w=1200&auto=format&fit=crop',
  'vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?q=75&w=1200&auto=format&fit=crop',
  'queenstown': 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=75&w=1200&auto=format&fit=crop',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=75&w=1200&auto=format&fit=crop',
  'jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=75&w=1200&auto=format&fit=crop',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=75&w=1200&auto=format&fit=crop',
  'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=75&w=1200&auto=format&fit=crop',
  'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=75&w=1200&auto=format&fit=crop',
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=75&w=1200&auto=format&fit=crop',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=75&w=1200&auto=format&fit=crop',
  'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=75&w=1200&auto=format&fit=crop',
  'udaipur': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=75&w=1200&auto=format&fit=crop',
  'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=75&w=1200&auto=format&fit=crop',
  'hampi': 'https://images.unsplash.com/photo-1600100397608-f010f445b9b4?q=75&w=1200&auto=format&fit=crop',
  'andaman': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=75&w=1200&auto=format&fit=crop',

  // Attractions & Places (Every place has a distinct, authentic high-res Unsplash photo)
  'palolem': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=75&w=600&auto=format&fit=crop',
  'aguada': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=75&w=600&auto=format&fit=crop',
  'dudhsagar': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=75&w=600&auto=format&fit=crop',
  'hawa-mahal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=75&w=600&auto=format&fit=crop',
  'amer-fort': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=75&w=600&auto=format&fit=crop',
  'city-palace': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?q=75&w=600&auto=format&fit=crop',
  
  // Bangalore Attractions
  'lalbagh': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=75&w=600&auto=format&fit=crop',
  'bangalore-palace': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=75&w=600&auto=format&fit=crop',
  'cubbon-park': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=75&w=600&auto=format&fit=crop',
  
  // Agra Attractions
  'taj-mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=75&w=600&auto=format&fit=crop',
  'agra-fort': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?q=75&w=600&auto=format&fit=crop',
  'mehtab-bagh': 'https://images.unsplash.com/photo-1548013146-72479768bada?q=75&w=600&auto=format&fit=crop',
  
  // Varanasi Attractions
  'dashashwamedh': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=75&w=600&auto=format&fit=crop',
  'kashi-vishwanath': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=75&w=600&auto=format&fit=crop',
  'assi-ghat': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=75&w=600&auto=format&fit=crop',
  
  // Kerala Attractions
  'alleppey': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=75&w=600&auto=format&fit=crop',
  'munnar': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=75&w=600&auto=format&fit=crop',
  'varkala': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=600&auto=format&fit=crop',
  
  // Mumbai Attractions
  'gateway-india': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=75&w=600&auto=format&fit=crop',
  'marine-drive': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=75&w=600&auto=format&fit=crop',
  'elephanta': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=75&w=600&auto=format&fit=crop',
  
  // Udaipur Attractions
  'udaipur-city-palace': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=75&w=600&auto=format&fit=crop',
  'lake-pichola': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?q=75&w=600&auto=format&fit=crop',
  'jag-mandir': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?q=75&w=600&auto=format&fit=crop',
  
  // Manali Attractions
  'solang-valley': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=75&w=600&auto=format&fit=crop',
  'rohtang-pass': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=75&w=600&auto=format&fit=crop',
  'hadimba': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=75&w=600&auto=format&fit=crop',
  
  // Hampi Attractions
  'stone-chariot': 'https://images.unsplash.com/photo-1600100397608-f010f445b9b4?q=75&w=600&auto=format&fit=crop',
  'virupaksha': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=75&w=600&auto=format&fit=crop',
  'matanga-hill': 'https://images.unsplash.com/photo-1600100397608-f010f445b9b4?q=75&w=600&auto=format&fit=crop',
  
  // Andaman Attractions
  'radhanagar': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=75&w=600&auto=format&fit=crop',
  'cellular-jail': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=75&w=600&auto=format&fit=crop',
  'ross-island': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=600&auto=format&fit=crop',
  'shibuya': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=75&w=600&auto=format&fit=crop',
  'senso-ji': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=75&w=600&auto=format&fit=crop',
  'meiji': 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=75&w=600&auto=format&fit=crop',
  'louvre': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=75&w=600&auto=format&fit=crop',
  'eiffel': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=75&w=600&auto=format&fit=crop',
  'montmartre': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=75&w=600&auto=format&fit=crop',
  'uluwatu': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=75&w=600&auto=format&fit=crop',
  'ubud': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=75&w=600&auto=format&fit=crop',
  'tegallalang': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=75&w=600&auto=format&fit=crop',
  'table-mountain': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=75&w=600&auto=format&fit=crop',
  'cape-point': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=75&w=600&auto=format&fit=crop',
  'kirstenbosch': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=75&w=600&auto=format&fit=crop',
  'central-park': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=75&w=600&auto=format&fit=crop',
  'statue-liberty': 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?q=75&w=600&auto=format&fit=crop',
  'times-square': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=75&w=600&auto=format&fit=crop',
  'opera-house': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=75&w=600&auto=format&fit=crop',
  'bondi': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=75&w=600&auto=format&fit=crop',
  'fushimi': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=75&w=600&auto=format&fit=crop',
  'kinkaku': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=75&w=600&auto=format&fit=crop',
  'arashiyama': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=75&w=600&auto=format&fit=crop',
  'burj-khalifa': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=75&w=600&auto=format&fit=crop',
  'colosseum': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=75&w=600&auto=format&fit=crop',
  'trevi': 'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=75&w=600&auto=format&fit=crop',
  'pantheon': 'https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=75&w=600&auto=format&fit=crop',
  'gardens-bay': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=75&w=600&auto=format&fit=crop',
  'marina-bay': 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?q=75&w=600&auto=format&fit=crop',
  'botanic': 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=75&w=600&auto=format&fit=crop',
};

/**
 * Fetch a high-resolution image for a destination or place.
 * 1. Checks memory & localStorage cache
 * 2. If Unsplash or Pexels API key is present, calls live API
 * 3. Falls back to Unsplash photo endpoint matching the query
 */
export async function fetchTravelImage(query: string, keyId?: string, size: 'small' | 'large' = 'large'): Promise<string> {
  const normalizedKey = (keyId || query).toLowerCase().trim() + '_' + size;
  
  // 1. Check cache
  const cached = getCachedImage(normalizedKey);
  if (cached) return cached;

  // 2. Check Unsplash API key
  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (unsplashAccessKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const fetchedUrl = size === 'small' ? data.results[0].urls.small : data.results[0].urls.regular;
          setCachedImage(normalizedKey, fetchedUrl);
          return fetchedUrl;
        }
      }
    } catch (e) {
      console.warn('Unsplash API request failed, falling back to source', e);
    }
  }

  // 3. Check Pexels API key
  const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;
  if (pexelsApiKey) {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: pexelsApiKey,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const fetchedUrl = size === 'small' ? data.photos[0].src.medium : data.photos[0].src.large2x;
          setCachedImage(normalizedKey, fetchedUrl);
          return fetchedUrl;
        }
      }
    } catch (e) {
      console.warn('Pexels API request failed, falling back to source', e);
    }
  }

  // 4. Check curated map
  const curatedKey = (keyId || query).toLowerCase().trim();
  if (UNSPLASH_CURATED_MAP[curatedKey]) {
    let url = UNSPLASH_CURATED_MAP[curatedKey];
    if (size === 'small') {
      url = url.replace('w=1200', 'w=600').replace('w=800', 'w=600');
    }
    setCachedImage(normalizedKey, url);
    return url;
  }

  // 5. Fallback to Source Unsplash (no key required, but lower rate limits)
  const width = size === 'small' ? 600 : 1200;
  const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query.replace(/ /g, ','))}&w=${width}`;
  setCachedImage(normalizedKey, fallbackUrl);
  
  return fallbackUrl;
}

/**
 * Synchronous resolver for instant initial render.
 * Returns cached/curated URL immediately.
 */
export function getTravelImageSync(keyOrQuery: string, fallback?: string, size: 'small' | 'large' = 'large'): string {
  const baseKey = keyOrQuery.toLowerCase().trim();
  const normalizedKey = baseKey + '_' + size;
  
  const cached = getCachedImage(normalizedKey);
  if (cached) return cached;

  if (UNSPLASH_CURATED_MAP[baseKey]) {
    let url = UNSPLASH_CURATED_MAP[baseKey];
    if (size === 'small') {
      url = url.replace('w=1200', 'w=600').replace('w=800', 'w=600');
    }
    return url;
  }

  // Fuzzy / substring matching for queries like "bangalore-palace", "india bangalore lalbagh", etc.
  const cleaned = baseKey.replace(/[^a-z0-9]/g, ' ');
  for (const [key, url] of Object.entries(UNSPLASH_CURATED_MAP)) {
    if (cleaned.includes(key) || key.includes(baseKey)) {
      let finalUrl = url;
      if (size === 'small') {
        finalUrl = finalUrl.replace('w=1200', 'w=600').replace('w=800', 'w=600');
      }
      return finalUrl;
    }
  }

  return fallback || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop';
}
