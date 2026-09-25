import React from 'react';
import {
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  Clock,
  Compass,
  ArrowUp,
  ArrowDown,
  Umbrella,
  SunDim,
} from 'lucide-react';
import { WeatherData, TemperatureUnit, GeoLocationResult } from '../types/weather';
import {
  getWMOInterpretation,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionCardinal,
} from '../utils/wmo';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  city: GeoLocationResult;
  unit: TemperatureUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, city, unit }) => {
  const current = weather.current_weather;
  const isDay = current.is_day !== undefined ? current.is_day === 1 : true;
  const condition = getWMOInterpretation(current.weathercode, isDay);

  const todayHigh = weather.daily?.temperature_2m_max?.[0] ?? current.temperature;
  const todayLow = weather.daily?.temperature_2m_min?.[0] ?? current.temperature;
  const todayPrecip = weather.daily?.precipitation_sum?.[0] ?? 0;
  const todayPrecipProb = weather.daily?.precipitation_probability_max?.[0] ?? 0;
  const uvMax = weather.daily?.uv_index_max?.[0] ?? 0;

  // Hourly nearest data for humidity and feels-like if available
  const hourlyTimeArr = weather.hourly?.time || [];
  let currentHourlyIndex = 0;
  if (current.time && hourlyTimeArr.length > 0) {
    const idx = hourlyTimeArr.findIndex((t) => t.startsWith(current.time.slice(0, 13)));
    if (idx !== -1) currentHourlyIndex = idx;
  }

  const feelsLike = weather.hourly?.apparent_temperature?.[currentHourlyIndex] ?? current.temperature;
  const humidity = weather.hourly?.relative_humidity_2m?.[currentHourlyIndex] ?? 55;

  // Local time formatting
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: weather.timezone || undefined,
  }).format(new Date());

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: weather.timezone || undefined,
  }).format(new Date());

  const cardinalWind = getWindDirectionCardinal(current.winddirection);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-xl">
      {/* Ambient background glow according to condition */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${condition.bgGradient} blur-3xl pointer-events-none opacity-60`}
      />

      {/* Top Location & Time Line */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/60 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
            <span>Atmospheric Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>{weather.timezone || 'Auto Timezone'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-0.5">
            {city.name}
            {city.admin1 && <span className="text-slate-400 font-normal">, {city.admin1}</span>}
            <span className="text-slate-400 font-normal ml-1.5 text-lg">({city.country})</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{formattedDate}</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Meteorological Core */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Big Temperature & Condition */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 shadow-inner flex items-center justify-center shrink-0">
            <WeatherIcon name={condition.iconName} className={`w-16 h-16 sm:w-20 sm:h-20 ${condition.color}`} />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-mono">
                {formatTemperature(current.temperature, unit).replace('°C', '').replace('°F', '')}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-sky-400">
                {unit === 'celsius' ? '°C' : '°F'}
              </span>
            </div>

            <div className="mt-1">
              <h3 className="text-xl font-bold text-slate-100">{condition.label}</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-0.5">{condition.description}</p>
            </div>

            {/* Daily Range */}
            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1 text-rose-300">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>High: {formatTemperature(todayHigh, unit)}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Low: {formatTemperature(todayLow, unit)}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <span>Feels like: {formatTemperature(feelsLike, unit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Environmental Matrix */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Wind */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Wind Speed</span>
              <Wind className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {formatWindSpeed(current.windspeed, 'kmh')}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <Compass className="w-3 h-3 text-slate-400" />
                <span>Heading: {cardinalWind} ({Math.round(current.winddirection)}°)</span>
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Humidity</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {Math.round(humidity)}%
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {humidity > 70 ? 'High moisture' : humidity < 35 ? 'Dry atmosphere' : 'Comfortable balance'}
              </p>
            </div>
          </div>

          {/* Precipitation Chance / Sum */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Precipitation</span>
              <Umbrella className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {todayPrecip.toFixed(1)} mm
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Probability: {todayPrecipProb}%
              </p>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">UV Index</span>
              <SunDim className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold font-mono text-slate-100">
                {uvMax.toFixed(1)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {uvMax >= 8 ? 'Very High (Caution)' : uvMax >= 6 ? 'High' : uvMax >= 3 ? 'Moderate' : 'Low risk'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
