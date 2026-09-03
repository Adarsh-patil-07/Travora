import { useState, useCallback } from 'react';
import type { Coordinates } from '../types';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'error';

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus('success');
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setStatus('denied');
          setError('Location permission denied.');
        } else {
          setStatus('error');
          setError('Unable to retrieve your location.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setCoordinates(null);
    setError(null);
  }, []);

  return { status, coordinates, error, requestLocation, reset, setCoordinates, setStatus };
}
