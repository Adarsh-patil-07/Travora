import { useState, useEffect } from 'react';
import { fetchLiveWeather, type WeatherData } from '../services/weather';

export function useWeather(lat: number, lng: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchLiveWeather(lat, lng)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load weather');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  return { weather, loading, error };
}
