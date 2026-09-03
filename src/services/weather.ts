/**
 * Live Weather Service
 * Fetches real-time live weather using Open-Meteo & OpenWeather.
 * Open-Meteo is used as a zero-config, highly accurate, keyless real-time weather engine.
 * Supports OpenWeather API key via VITE_OPENWEATHER_API_KEY if provided.
 */

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string; // emoji or icon code
  humidity: number;
  windSpeed: number; // km/h
  visibility: number; // km
}

// Mapping WMO weather codes from Open-Meteo to human-readable condition & emoji
function parseWmoCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code === 3) return { condition: 'Overcast', icon: '☁️' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { condition: 'Drizzle', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { condition: 'Rainy', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snowy', icon: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌧️' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Sunny', icon: '☀️' };
}

/**
 * Fetches live real-time weather by latitude and longitude.
 */
export async function fetchLiveWeather(lat: number, lng: number): Promise<WeatherData> {
  const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 1. Try OpenWeather if API Key is configured
  if (openWeatherKey) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${openWeatherKey}`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0]?.main || 'Clear',
          icon: getWeatherEmoji(data.weather[0]?.main),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // convert m/s to km/h
          visibility: Math.round((data.visibility || 10000) / 1000), // convert m to km
        };
      }
    } catch (err) {
      console.warn('OpenWeather request failed, using Open-Meteo fallback', err);
    }
  }

  // 2. Open-Meteo live real-time weather (Free, no API key required, reliable)
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility&timezone=auto`
    );
    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const { condition, icon } = parseWmoCode(current.weather_code ?? 0);
      
      return {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition,
        icon,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        visibility: Math.round((current.visibility || 10000) / 1000),
      };
    }
  } catch (error) {
    console.error('Failed to fetch live weather from Open-Meteo', error);
  }

  // Fallback defaults if offline
  return {
    temp: 24,
    feelsLike: 25,
    condition: 'Sunny',
    icon: '☀️',
    humidity: 50,
    windSpeed: 12,
    visibility: 10,
  };
}

function getWeatherEmoji(condition?: string): string {
  if (!condition) return '☀️';
  const c = condition.toLowerCase();
  if (c.includes('rain')) return '🌧️';
  if (c.includes('cloud')) return '⛅';
  if (c.includes('snow')) return '❄️';
  if (c.includes('thunder') || c.includes('storm')) return '⛈️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  return '☀️';
}
