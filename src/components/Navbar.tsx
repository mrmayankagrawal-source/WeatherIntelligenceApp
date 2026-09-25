import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Compass, Globe } from 'lucide-react';
import { GeoLocationResult, TemperatureUnit } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface NavbarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  currentCityName?: string;
}

const POPULAR_CITIES: GeoLocationResult[] = [
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', admin1: 'New South Wales' },
  { id: 1880252, name: 'Singapore', latitude: 1.2897, longitude: 103.8501, country: 'Singapore' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  unit,
  onToggleUnit,
  currentCityName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchTerm.trim(), 5);
        setSuggestions(results);
        setIsDropdownOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // Direct search on Enter
    setIsSearching(true);
    try {
      const results = await searchCities(searchTerm.trim(), 1);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        alert(`No city found matching "${searchTerm}". Please check the spelling.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    setSearchTerm('');
    setSuggestions([]);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                  Weather Intelligence
                </h1>
                <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                  Open-Meteo Meteorological Engine
                </p>
              </div>
            </div>

            {/* Mobile Controls Right */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onUseCurrentLocation}
                disabled={isLocating}
                title="Use Current Location"
                aria-label="Use Current Location"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <MapPin className="w-4 h-4 text-sky-400" />}
              </button>
              <button
                onClick={onToggleUnit}
                className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Toggle Temperature Unit"
              >
                {unit === 'celsius' ? '°C' : '°F'}
              </button>
            </div>
          </div>

          {/* Search Box with Autocomplete */}
          <div className="relative flex-1 max-w-xl" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search city by name (e.g. Berlin, Tokyo, Chicago)..."
                  className="w-full pl-10 pr-20 py-2 text-sm bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/80 transition-all"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSuggestions([]);
                        setIsDropdownOpen(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin mr-1" />
                  )}
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-medium bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-lg hover:bg-sky-500/30 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 backdrop-blur-xl">
                {suggestions.map((city, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={`${city.id}-${index}`}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-sm transition-colors ${
                        isSelected ? 'bg-sky-500/20 text-sky-200' : 'text-slate-200 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="font-medium text-slate-100">{city.name}</span>
                        {city.admin1 && (
                          <span className="text-xs text-slate-400">, {city.admin1}</span>
                        )}
                        <span className="text-xs text-slate-400">({city.country})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Utilities */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>My Location</span>
                </>
              )}
            </button>

            {/* Segmented Unit Control */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => unit !== 'celsius' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  unit === 'celsius'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  unit === 'fahrenheit'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Popular Quick Navigation */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 text-[11px] font-mono">
            <Globe className="w-3 h-3 text-slate-400" />
            Quick Select:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {POPULAR_CITIES.map((c) => {
              const isCurrent = currentCityName && c.name.toLowerCase() === currentCityName.toLowerCase();
              return (
                <button
                  key={c.name}
                  onClick={() => onSelectCity(c)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    isCurrent
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
