import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplets, ArrowUp, ArrowDown, MapPin, Sun, Cloud, CloudRain, CloudLightning, Snowflake, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherData, DailyForecast } from '../types';
import { getRealtimeWeather } from '../services/geminiService';

const WeatherIcon = ({ type, className }: { type: string, className?: string }) => {
  const t = type.toLowerCase();
  if (t.includes('sun') || t.includes('clear')) return <Sun className={`text-yellow-400 ${className}`} />;
  if (t.includes('cloud')) return <Cloud className={`text-gray-400 ${className}`} />;
  if (t.includes('rain') || t.includes('drizzle')) return <CloudRain className={`text-blue-400 ${className}`} />;
  if (t.includes('storm') || t.includes('thunder')) return <CloudLightning className={`text-purple-400 ${className}`} />;
  if (t.includes('snow') || t.includes('ice')) return <Snowflake className={`text-cyan-200 ${className}`} />;
  return <Sun className={`text-yellow-400 ${className}`} />;
};

const DEFAULT_CITY = 'Tokyo';

const WeatherView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');

  // Derived chart data (simulated curve based on real temp for visual consistency)
  const chartData = weather ? Array.from({ length: 8 }).map((_, i) => ({
    time: `${(new Date().getHours() + i) % 24}:00`,
    temp: weather.temp + (Math.sin(i) * 2) // subtle curve around actual temp
  })) : [];

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    setLocationStatus(`Fetching data for ${city}...`);
    try {
      const data = await getRealtimeWeather(city);
      if (data) {
        setWeather(data);
        setLocationStatus(`Showing: ${data.city}`);
      } else {
        setError("Unable to establish planetary uplink. Try another coordinate.");
      }
    } catch (e) {
      setError("Atmospheric sensors offline.");
    } finally {
      setLoading(false);
    }
  };

  // Reverse geocode coordinates to city name using OpenStreetMap Nominatim
  const getCityFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
      );
      const data = await response.json();
      // Try to get city, town, village, or county
      const city = data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        data.address?.state;
      const country = data.address?.country;
      return city ? `${city}, ${country}` : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  };

  // Get user's location using browser Geolocation API
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      fetchWeather(DEFAULT_CITY);
      return;
    }

    setLocationStatus('Acquiring coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus('Resolving location...');
        const cityName = await getCityFromCoords(latitude, longitude);
        setLocationStatus(`Located: ${cityName}`);
        fetchWeather(cityName);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setLocationStatus('Location access denied');
        fetchWeather(DEFAULT_CITY);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // Cache position for 5 minutes
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    fetchWeather(search);
    setSearch('');
  };

  if (loading && !weather) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full animate-fade-in space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
        </div>
        <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse uppercase">{locationStatus}</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-[80vh] text-center">
        <CloudLightning size={64} className="text-red-400 mb-6 opacity-80" />
        <h3 className="text-2xl font-bold text-white mb-2">Transmission Failed</h3>
        <p className="text-gray-400 mb-8">{error || "Unknown error occurred."}</p>
        <button
          onClick={() => fetchWeather(DEFAULT_CITY)}
          className="px-6 py-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors"
        >
          Re-initialize System
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Atmospheric Data</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time planetary monitoring</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
          <input
            type="text"
            placeholder="Search sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            className="w-full bg-orbit-deep/50 border border-orbit-glassBorder text-white placeholder-gray-500 rounded-full py-2.5 pl-10 pr-12 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
          />
          <Search className="absolute left-3.5 top-3 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
          {loading && (
            <Loader2 className="absolute right-3.5 top-3 text-cyan-500 animate-spin" size={16} />
          )}
        </form>
      </div>

      {/* Main Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Conditions */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <MapPin size={16} />
                <span className="uppercase tracking-widest text-xs font-semibold">{weather.city}</span>
              </div>
              <div className="flex items-end gap-4">
                <h1 className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                  {Math.round(weather.temp)}°
                </h1>
                <div className="pb-4">
                  <p className="text-xl text-gray-300 capitalize">{weather.condition}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center"><ArrowUp size={14} className="mr-1" />{Math.round(weather.high)}°</span>
                    <span className="flex items-center"><ArrowDown size={14} className="mr-1" />{Math.round(weather.low)}°</span>
                  </div>
                </div>
              </div>
            </div>
            <WeatherIcon type={weather.condition} className="w-24 h-24 opacity-80" />
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-500/20 rounded-full text-indigo-400 mt-0.5 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-indigo-300 uppercase tracking-wider font-bold mb-1">Orbit AI Insight</p>
                <p className="text-sm text-gray-200 leading-relaxed italic">
                  "{weather.description}"
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-orbit-dark/50 border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="p-2.5 bg-blue-500/20 rounded-full text-blue-400">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Humidity</p>
                <p className="text-lg font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-orbit-dark/50 border border-white/5 hover:border-teal-500/30 transition-colors">
              <div className="p-2.5 bg-teal-500/20 rounded-full text-teal-400">
                <Wind size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Wind</p>
                <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
            5-Day Forecast
          </h3>
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {weather.forecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5">
                <span className="w-12 text-gray-400 font-medium">{day.day}</span>
                <WeatherIcon type={day.icon} className="w-6 h-6" />
                <span className="font-display font-bold text-white">{Math.round(day.temp)}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="glass-panel rounded-3xl p-8 h-80 w-full relative">
        <h3 className="text-lg font-semibold mb-4 absolute top-8 left-8 z-10">Temperature Trend (24h)</h3>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#22d3ee' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WeatherView;