import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, Snowflake, CloudLightning, Droplets, Wind } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import Skeleton from '../ui/Skeleton';
import ErrorFallback from '../ui/ErrorFallback';

// Map icon strings to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  'sun': Sun,
  'cloud-sun': CloudSun,
  'cloud': Cloud,
  'cloud-fog': CloudFog,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'snowflake': Snowflake,
  'cloud-lightning': CloudLightning,
};

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  locationName: string;
}

export default function WeatherWidget({ lat, lng, locationName }: WeatherWidgetProps) {
  const { data, loading, error } = useWeather(lat, lng);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-surface border border-border rounded-3xl p-6">
        <ErrorFallback 
          message={`Unable to load weather for ${locationName}`}
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  const WeatherIcon = IconMap[data.icon] || Cloud;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-muted">
          Current Weather
        </p>
        <p className="font-instrument-serif text-3xl text-text mt-1">
          {locationName}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <WeatherIcon className="w-16 h-16 text-accent" strokeWidth={1} />
        <div>
          <span className="text-5xl font-light tracking-tighter text-text">
            {data.temperature}°
          </span>
          <p className="text-lg text-muted capitalize">
            {data.condition}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-muted" />
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Humidity</p>
            <p className="font-medium text-text">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-muted" />
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Wind</p>
            <p className="font-medium text-text">{data.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
          <Sun className="w-5 h-5 text-muted" />
          <div>
            <p className="text-xs text-muted uppercase tracking-wider">Feels Like</p>
            <p className="font-medium text-text">{data.feelsLike}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}
