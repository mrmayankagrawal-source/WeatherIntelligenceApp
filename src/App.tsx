import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, RotateCcw, ShieldCheck, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { GeoLocationResult, WeatherData, TemperatureUnit } from './types/weather';
import { fetchWeatherForecast, reverseGeocodeCoords, searchCities } from './services/openMeteo';
import { Navbar } from './components/Navbar';
import { CurrentWeather } from './components/CurrentWeather';
import { SmartRecommendations } from './components/SmartRecommendations';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { AtmosphericDetails } from './components/AtmosphericDetails';
import { LoadingSkeleton, ErrorMessage } from './components/LoadingSkeleton';

// Default initial city (London)
const DEFAULT_CITY: GeoLocationResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.5085,
  longitude: -0.1257,
  country: 'United Kingdom',
  admin1: 'England',
  timezone: 'Europe/London',
};

export default function App() {
  const [city, setCity] = useState<GeoLocationResult>(() => {
    try {
      const saved = localStorage.getItem('weather_intel_last_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem('weather_intel_unit');
      return (saved as TemperatureUnit) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load weather for a given city
  const loadWeather = useCallback(async (targetCity: GeoLocationResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(targetCity.latitude, targetCity.longitude);
      setWeatherData(data);
      setCity(targetCity);
      setLastUpdated(new Date());

      try {
        localStorage.setItem('weather_intel_last_city', JSON.stringify(targetCity));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to retrieve meteorological data for this location.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather on mount
  useEffect(() => {
    loadWeather(city);
  }, [loadWeather]);

  // Toggle unit
  const handleToggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      try {
        localStorage.setItem('weather_intel_unit', next);
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return next;
    });
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resolvedCity = await reverseGeocodeCoords(latitude, longitude);
          await loadWeather(resolvedCity);
        } catch (err) {
          console.error(err);
          // Fallback with coordinates
          await loadWeather({
            id: Date.now(),
            name: 'Local Coordinates',
            latitude,
            longitude,
            country: 'Detected Location',
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert(
          err.code === 1
            ? 'Location permission was denied. Please allow location access or search your city in the search bar.'
            : 'Could not determine accurate location coordinates.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation & Search Bar */}
      <Navbar
        onSelectCity={(newCity) => loadWeather(newCity)}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        currentCityName={city.name}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Error State */}
        {error && !isLoading && (
          <ErrorMessage
            message={error}
            searchedCity={city.name}
            onRetry={() => loadWeather(city)}
          />
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Loaded Weather Dashboard */}
        {!isLoading && weatherData && (
          <div className="space-y-8">
            {/* Live Refresh & Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Open-Meteo Stream</span>
                {lastUpdated && (
                  <span className="hidden sm:inline">
                    · Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button
                onClick={() => loadWeather(city)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Refresh current data"
              >
                <RefreshCw className="w-3 h-3 text-sky-400" />
                <span>Refresh</span>
              </button>
            </div>

            {/* 1. Current Weather Card */}
            <CurrentWeather weather={weatherData} city={city} unit={unit} />

            {/* 2. Smart Planning Recommendations */}
            <SmartRecommendations weather={weatherData} />

            {/* 3. 24-Hour Horizon Track */}
            {weatherData.hourly && (
              <HourlyForecast
                hourly={weatherData.hourly}
                currentTimeString={weatherData.current_weather.time}
                unit={unit}
              />
            )}

            {/* 4. 7-Day Forecast Grid */}
            <DailyForecast daily={weatherData.daily} unit={unit} />

            {/* 5. Atmospheric & Environmental Metrics */}
            <AtmosphericDetails weather={weatherData} unit={unit} />
          </div>
        )}
      </main>

      {/* Cloudflare Pages Ready Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span className="text-slate-300 font-semibold">Weather Intelligence</span>
            <span>·</span>
            <span>Cloudflare Pages Ready</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Open-Meteo API</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              CC BY 4.0
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
