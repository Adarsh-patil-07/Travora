import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weather';
import type { WeatherData } from '../types';

export function useWeather(lat: number, lng: number) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await fetchWeather(lat, lng);
        if (mounted) {
          setData(weatherData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, [lat, lng]);

  return { data, loading, error };
}
