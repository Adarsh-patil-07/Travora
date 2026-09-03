import type { WeatherData } from '../types';

/**
 * Maps WMO weather codes to human-readable conditions and Lucide icons.
 * Reference: https://open-meteo.com/en/docs
 */
export function mapWeatherCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear sky', icon: 'sun' };
  if (code === 1) return { condition: 'Mainly clear', icon: 'sun' };
  if (code === 2) return { condition: 'Partly cloudy', icon: 'cloud-sun' };
  if (code === 3) return { condition: 'Overcast', icon: 'cloud' };
  if ([45, 48].includes(code)) return { condition: 'Fog', icon: 'cloud-fog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Drizzle', icon: 'cloud-drizzle' };
  if ([61, 63, 65, 66, 67].includes(code)) return { condition: 'Rain', icon: 'cloud-rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snow', icon: 'snowflake' };
  if ([80, 81, 82].includes(code)) return { condition: 'Rain showers', icon: 'cloud-rain' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: 'cloud-lightning' };
  
  return { condition: 'Unknown', icon: 'cloud' };
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  // Using Open-Meteo free API (no key required)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=kmh`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  const current = data.current;
  const { condition, icon } = mapWeatherCode(current.weather_code);

  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    visibility: 10, // Open-Meteo current doesn't always provide visibility, mocking for design
    condition,
    icon,
  };
}
