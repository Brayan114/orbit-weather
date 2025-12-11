export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  description: string; // AI Generated
  forecast: DailyForecast[];
}

export interface DailyForecast {
  day: string;
  temp: number;
  icon: 'sun' | 'cloud' | 'rain' | 'storm' | 'snow';
}

export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  dueDate?: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  active: boolean;
  days: number[]; // 0=Sunday, 1=Monday, etc. Empty = one-time
  repeat: boolean;
}

export enum AppView {
  WEATHER = 'WEATHER',
  CLOCK = 'CLOCK',
  TOOLS = 'TOOLS', // Alarm, Timer, Stopwatch
  REMINDERS = 'REMINDERS',
  CALENDAR = 'CALENDAR',
}

export interface WorldClockCity {
  city: string;
  region: string;
  timezone: string;
  lat: number;
  lng: number;
}