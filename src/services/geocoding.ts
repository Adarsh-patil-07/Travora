export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

/**
 * Uses the free OpenStreetMap Nominatim API to search for locations by name.
 * Respects the OSM terms of service (no API key needed, but requires a user-agent ideally, 
 * standard browser fetch is usually fine for client-side demo limits).
 */
export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    // Map the raw OSM data to our clean GeocodingResult interface
    return data.map((item: any) => {
      // Create a clean name from the address components
      const address = item.address;
      const city = address.city || address.town || address.village || address.county;
      const country = address.country;
      
      const cleanName = city && country ? `${city}, ${country}` : item.display_name.split(',').slice(0, 2).join(',');

      return {
        name: cleanName,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        country: country
      };
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return [];
  }
}
