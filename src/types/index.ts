// Continent type
export type Continent = 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';

// Mood/tag categories
export type MoodTag = 'adventure' | 'beach' | 'culture' | 'nature' | 'food' | 'city';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  imageQuery: string;
  imageUrl?: string;
  category: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  coordinates: Coordinates;
  description: string;
  imageQuery: string;
  imageUrl?: string;
  tags: MoodTag[];
  bestTimeToVisit: string;
  famousPlaces: Place[];
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  duration: string;
  days: ItineraryDay[];
}

export interface GeolocationState {
  status: 'idle' | 'loading' | 'success' | 'denied' | 'error';
  coordinates: Coordinates | null;
  error?: string;
}
