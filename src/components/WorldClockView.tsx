import React, { useState, useEffect } from 'react';
import { WorldClockCity } from '../types';
import { Plus, Trash2, Search, X, Globe, ChevronRight } from 'lucide-react';

// --- Comprehensive City Database organized by region ---
const CITY_DATABASE: Record<string, WorldClockCity[]> = {
  'North America': [
    { city: 'New York', region: 'USA', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
    { city: 'Los Angeles', region: 'USA', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
    { city: 'Chicago', region: 'USA', timezone: 'America/Chicago', lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', region: 'USA', timezone: 'America/Chicago', lat: 29.7604, lng: -95.3698 },
    { city: 'Phoenix', region: 'USA', timezone: 'America/Phoenix', lat: 33.4484, lng: -112.0740 },
    { city: 'Miami', region: 'USA', timezone: 'America/New_York', lat: 25.7617, lng: -80.1918 },
    { city: 'Denver', region: 'USA', timezone: 'America/Denver', lat: 39.7392, lng: -104.9903 },
    { city: 'Seattle', region: 'USA', timezone: 'America/Los_Angeles', lat: 47.6062, lng: -122.3321 },
    { city: 'Toronto', region: 'Canada', timezone: 'America/Toronto', lat: 43.6532, lng: -79.3832 },
    { city: 'Vancouver', region: 'Canada', timezone: 'America/Vancouver', lat: 49.2827, lng: -123.1207 },
    { city: 'Montreal', region: 'Canada', timezone: 'America/Montreal', lat: 45.5017, lng: -73.5673 },
    { city: 'Mexico City', region: 'Mexico', timezone: 'America/Mexico_City', lat: 19.4326, lng: -99.1332 },
    { city: 'Cancun', region: 'Mexico', timezone: 'America/Cancun', lat: 21.1619, lng: -86.8515 },
  ],
  'South America': [
    { city: 'São Paulo', region: 'Brazil', timezone: 'America/Sao_Paulo', lat: -23.5505, lng: -46.6333 },
    { city: 'Rio de Janeiro', region: 'Brazil', timezone: 'America/Sao_Paulo', lat: -22.9068, lng: -43.1729 },
    { city: 'Buenos Aires', region: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', lat: -34.6037, lng: -58.3816 },
    { city: 'Lima', region: 'Peru', timezone: 'America/Lima', lat: -12.0464, lng: -77.0428 },
    { city: 'Bogotá', region: 'Colombia', timezone: 'America/Bogota', lat: 4.7110, lng: -74.0721 },
    { city: 'Santiago', region: 'Chile', timezone: 'America/Santiago', lat: -33.4489, lng: -70.6693 },
    { city: 'Caracas', region: 'Venezuela', timezone: 'America/Caracas', lat: 10.4806, lng: -66.9036 },
  ],
  'Europe': [
    { city: 'London', region: 'UK', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
    { city: 'Paris', region: 'France', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
    { city: 'Berlin', region: 'Germany', timezone: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 },
    { city: 'Madrid', region: 'Spain', timezone: 'Europe/Madrid', lat: 40.4168, lng: -3.7038 },
    { city: 'Rome', region: 'Italy', timezone: 'Europe/Rome', lat: 41.9028, lng: 12.4964 },
    { city: 'Amsterdam', region: 'Netherlands', timezone: 'Europe/Amsterdam', lat: 52.3676, lng: 4.9041 },
    { city: 'Brussels', region: 'Belgium', timezone: 'Europe/Brussels', lat: 50.8503, lng: 4.3517 },
    { city: 'Vienna', region: 'Austria', timezone: 'Europe/Vienna', lat: 48.2082, lng: 16.3738 },
    { city: 'Zurich', region: 'Switzerland', timezone: 'Europe/Zurich', lat: 47.3769, lng: 8.5417 },
    { city: 'Stockholm', region: 'Sweden', timezone: 'Europe/Stockholm', lat: 59.3293, lng: 18.0686 },
    { city: 'Oslo', region: 'Norway', timezone: 'Europe/Oslo', lat: 59.9139, lng: 10.7522 },
    { city: 'Copenhagen', region: 'Denmark', timezone: 'Europe/Copenhagen', lat: 55.6761, lng: 12.5683 },
    { city: 'Helsinki', region: 'Finland', timezone: 'Europe/Helsinki', lat: 60.1699, lng: 24.9384 },
    { city: 'Dublin', region: 'Ireland', timezone: 'Europe/Dublin', lat: 53.3498, lng: -6.2603 },
    { city: 'Lisbon', region: 'Portugal', timezone: 'Europe/Lisbon', lat: 38.7223, lng: -9.1393 },
    { city: 'Athens', region: 'Greece', timezone: 'Europe/Athens', lat: 37.9838, lng: 23.7275 },
    { city: 'Prague', region: 'Czech Republic', timezone: 'Europe/Prague', lat: 50.0755, lng: 14.4378 },
    { city: 'Warsaw', region: 'Poland', timezone: 'Europe/Warsaw', lat: 52.2297, lng: 21.0122 },
    { city: 'Budapest', region: 'Hungary', timezone: 'Europe/Budapest', lat: 47.4979, lng: 19.0402 },
    { city: 'Moscow', region: 'Russia', timezone: 'Europe/Moscow', lat: 55.7558, lng: 37.6173 },
    { city: 'Istanbul', region: 'Turkey', timezone: 'Europe/Istanbul', lat: 41.0082, lng: 28.9784 },
    { city: 'Kyiv', region: 'Ukraine', timezone: 'Europe/Kyiv', lat: 50.4501, lng: 30.5234 },
  ],
  'Asia': [
    { city: 'Tokyo', region: 'Japan', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503 },
    { city: 'Osaka', region: 'Japan', timezone: 'Asia/Tokyo', lat: 34.6937, lng: 135.5023 },
    { city: 'Beijing', region: 'China', timezone: 'Asia/Shanghai', lat: 39.9042, lng: 116.4074 },
    { city: 'Shanghai', region: 'China', timezone: 'Asia/Shanghai', lat: 31.2304, lng: 121.4737 },
    { city: 'Hong Kong', region: 'China', timezone: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694 },
    { city: 'Singapore', region: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
    { city: 'Seoul', region: 'South Korea', timezone: 'Asia/Seoul', lat: 37.5665, lng: 126.9780 },
    { city: 'Mumbai', region: 'India', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777 },
    { city: 'New Delhi', region: 'India', timezone: 'Asia/Kolkata', lat: 28.6139, lng: 77.2090 },
    { city: 'Bangalore', region: 'India', timezone: 'Asia/Kolkata', lat: 12.9716, lng: 77.5946 },
    { city: 'Bangkok', region: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.7563, lng: 100.5018 },
    { city: 'Jakarta', region: 'Indonesia', timezone: 'Asia/Jakarta', lat: -6.2088, lng: 106.8456 },
    { city: 'Manila', region: 'Philippines', timezone: 'Asia/Manila', lat: 14.5995, lng: 120.9842 },
    { city: 'Kuala Lumpur', region: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', lat: 3.1390, lng: 101.6869 },
    { city: 'Dubai', region: 'UAE', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
    { city: 'Abu Dhabi', region: 'UAE', timezone: 'Asia/Dubai', lat: 24.4539, lng: 54.3773 },
    { city: 'Riyadh', region: 'Saudi Arabia', timezone: 'Asia/Riyadh', lat: 24.7136, lng: 46.6753 },
    { city: 'Tel Aviv', region: 'Israel', timezone: 'Asia/Jerusalem', lat: 32.0853, lng: 34.7818 },
    { city: 'Doha', region: 'Qatar', timezone: 'Asia/Qatar', lat: 25.2854, lng: 51.5310 },
    { city: 'Karachi', region: 'Pakistan', timezone: 'Asia/Karachi', lat: 24.8607, lng: 67.0011 },
    { city: 'Dhaka', region: 'Bangladesh', timezone: 'Asia/Dhaka', lat: 23.8103, lng: 90.4125 },
    { city: 'Hanoi', region: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 21.0278, lng: 105.8342 },
    { city: 'Ho Chi Minh City', region: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 10.8231, lng: 106.6297 },
  ],
  'Africa': [
    { city: 'Cairo', region: 'Egypt', timezone: 'Africa/Cairo', lat: 30.0444, lng: 31.2357 },
    { city: 'Lagos', region: 'Nigeria', timezone: 'Africa/Lagos', lat: 6.5244, lng: 3.3792 },
    { city: 'Abuja', region: 'Nigeria', timezone: 'Africa/Lagos', lat: 9.0579, lng: 7.4951 },
    { city: 'Johannesburg', region: 'South Africa', timezone: 'Africa/Johannesburg', lat: -26.2041, lng: 28.0473 },
    { city: 'Cape Town', region: 'South Africa', timezone: 'Africa/Johannesburg', lat: -33.9249, lng: 18.4241 },
    { city: 'Nairobi', region: 'Kenya', timezone: 'Africa/Nairobi', lat: -1.2921, lng: 36.8219 },
    { city: 'Casablanca', region: 'Morocco', timezone: 'Africa/Casablanca', lat: 33.5731, lng: -7.5898 },
    { city: 'Accra', region: 'Ghana', timezone: 'Africa/Accra', lat: 5.6037, lng: -0.1870 },
    { city: 'Addis Ababa', region: 'Ethiopia', timezone: 'Africa/Addis_Ababa', lat: 8.9806, lng: 38.7578 },
    { city: 'Dar es Salaam', region: 'Tanzania', timezone: 'Africa/Dar_es_Salaam', lat: -6.7924, lng: 39.2083 },
    { city: 'Kampala', region: 'Uganda', timezone: 'Africa/Kampala', lat: 0.3476, lng: 32.5825 },
    { city: 'Kigali', region: 'Rwanda', timezone: 'Africa/Kigali', lat: -1.9403, lng: 29.8739 },
    { city: 'Tunis', region: 'Tunisia', timezone: 'Africa/Tunis', lat: 36.8065, lng: 10.1815 },
    { city: 'Algiers', region: 'Algeria', timezone: 'Africa/Algiers', lat: 36.7538, lng: 3.0588 },
  ],
  'Oceania': [
    { city: 'Sydney', region: 'Australia', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
    { city: 'Melbourne', region: 'Australia', timezone: 'Australia/Melbourne', lat: -37.8136, lng: 144.9631 },
    { city: 'Brisbane', region: 'Australia', timezone: 'Australia/Brisbane', lat: -27.4698, lng: 153.0251 },
    { city: 'Perth', region: 'Australia', timezone: 'Australia/Perth', lat: -31.9505, lng: 115.8605 },
    { city: 'Auckland', region: 'New Zealand', timezone: 'Pacific/Auckland', lat: -36.8485, lng: 174.7633 },
    { city: 'Wellington', region: 'New Zealand', timezone: 'Pacific/Auckland', lat: -41.2866, lng: 174.7756 },
    { city: 'Fiji', region: 'Fiji', timezone: 'Pacific/Fiji', lat: -18.1416, lng: 178.4419 },
    { city: 'Honolulu', region: 'Hawaii, USA', timezone: 'Pacific/Honolulu', lat: 21.3069, lng: -157.8583 },
  ],
};

// Flatten for search
const ALL_CITIES = Object.values(CITY_DATABASE).flat();
const REGIONS = Object.keys(CITY_DATABASE);

const INITIAL_CITIES: WorldClockCity[] = [
  ALL_CITIES.find(c => c.city === 'New York')!,
  ALL_CITIES.find(c => c.city === 'London')!,
  ALL_CITIES.find(c => c.city === 'Tokyo')!,
  ALL_CITIES.find(c => c.city === 'Sydney')!,
];

// --- Main Clock Card ---
const ClockCard: React.FC<{ city: WorldClockCity, onDelete: () => void }> = ({ city, onDelete }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localTime = new Date(time.toLocaleString("en-US", { timeZone: city.timezone }));

  const timeString = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const ampm = localTime.toLocaleTimeString([], { hour12: true }).split(' ')[1];
  const dateString = localTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const offset = -localTime.getTimezoneOffset() / 60;
  const localOffset = -new Date().getTimezoneOffset() / 60;
  const diff = offset - localOffset;
  const diffString = diff === 0 ? 'Local Time' : `${diff > 0 ? '+' : ''}${diff} HRS`;

  return (
    <div className="glass-panel rounded-2xl p-6 relative group hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">{city.city}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{city.region}</p>
        </div>
        <button onClick={onDelete} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-display font-bold text-white">{timeString}</span>
        <span className="text-lg text-gray-400 font-medium">{ampm}</span>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm border-t border-white/5 pt-4">
        <span className="text-gray-400">{dateString}</span>
        <span className="text-cyan-400 font-mono bg-cyan-900/20 px-2 py-0.5 rounded text-xs">{diffString}</span>
      </div>
    </div>
  );
};

// --- Modal Component with Browse and Search ---
const AddLocationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (city: WorldClockCity) => void;
  existingCities: WorldClockCity[];
}> = ({ isOpen, onClose, onAdd, existingCities }) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [view, setView] = useState<'browse' | 'search'>('browse');

  if (!isOpen) return null;

  // Filter cities based on search or selected region
  const getFilteredCities = () => {
    if (view === 'search' && search.trim()) {
      return ALL_CITIES.filter(c =>
        (c.city.toLowerCase().includes(search.toLowerCase()) ||
          c.region.toLowerCase().includes(search.toLowerCase())) &&
        !existingCities.find(ex => ex.city === c.city)
      );
    }
    if (selectedRegion) {
      return CITY_DATABASE[selectedRegion].filter(c =>
        !existingCities.find(ex => ex.city === c.city)
      );
    }
    return [];
  };

  const filteredCities = getFilteredCities();

  const handleBack = () => {
    if (selectedRegion) {
      setSelectedRegion(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.trim()) {
      setView('search');
      setSelectedRegion(null);
    } else {
      setView('browse');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-orbit-deep border border-orbit-glassBorder w-full max-w-lg h-[600px] rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            {selectedRegion && (
              <button onClick={handleBack} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={18} className="rotate-180" />
              </button>
            )}
            <h2 className="text-xl font-display font-bold text-white">
              {selectedRegion || 'Add Location'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 bg-gradient-to-b from-orbit-deep to-black overflow-hidden">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search all cities..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-indigo-500/50 focus:outline-none placeholder-gray-500"
              autoFocus
            />
          </div>

          {/* View Toggle */}
          {!selectedRegion && !search && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView('browse')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'browse' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                Browse Regions
              </button>
              <button
                onClick={() => { setView('search'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'search' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                Search All
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {/* Region List (Browse Mode) */}
            {view === 'browse' && !selectedRegion && !search && (
              <>
                {REGIONS.map(region => {
                  const availableCities = CITY_DATABASE[region].filter(c =>
                    !existingCities.find(ex => ex.city === c.city)
                  ).length;

                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-indigo-500/30 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                          <Globe size={18} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{region}</p>
                          <p className="text-xs text-gray-500">{availableCities} locations available</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  );
                })}
              </>
            )}

            {/* City List (when region selected or searching) */}
            {(selectedRegion || (view === 'search' && search)) && (
              <>
                {filteredCities.map(city => (
                  <button
                    key={city.city}
                    onClick={() => { onAdd(city); onClose(); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-indigo-500/30 transition-all group text-left"
                  >
                    <div>
                      <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{city.city}</p>
                      <p className="text-xs text-gray-500">{city.region}</p>
                    </div>
                    <Plus size={18} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <Search size={24} className="mb-2 opacity-20" />
                    <p className="text-sm">{search ? 'No matching cities found.' : 'All cities already added.'}</p>
                  </div>
                )}
              </>
            )}

            {/* Empty state for search mode without query */}
            {view === 'search' && !search && !selectedRegion && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Search size={24} className="mb-2 opacity-20" />
                <p className="text-sm">Type to search {ALL_CITIES.length} locations worldwide</p>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500">
              <span className="text-cyan-400 font-semibold">{ALL_CITIES.length}</span> cities across <span className="text-indigo-400 font-semibold">{REGIONS.length}</span> regions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main View ---
const WorldClockView: React.FC = () => {
  const [cities, setCities] = useState<WorldClockCity[]>(INITIAL_CITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCity = (city: WorldClockCity) => {
    if (!cities.find(c => c.city === city.city)) {
      setCities([...cities, city]);
    }
  };

  const removeCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto h-full flex flex-col animate-fade-in relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-white">World Clock</h2>
            <p className="text-gray-400 text-sm mt-1">Synchronized global timelines • {ALL_CITIES.length} locations</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} /> Add Location
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, idx) => (
            <ClockCard key={idx} city={city} onDelete={() => removeCity(idx)} />
          ))}
        </div>
      </div>

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCity}
        existingCities={cities}
      />
    </>
  );
};

export default WorldClockView;