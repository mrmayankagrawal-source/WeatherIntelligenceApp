import React from 'react';
import {
  Sunrise,
  Sunset,
  Gauge,
  Eye,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  Mountain,
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/wmo';

interface AtmosphericDetailsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const AtmosphericDetails: React.FC<AtmosphericDetailsProps> = ({ weather, unit }) => {
  const sunrise = weather.daily?.sunrise?.[0];
  const sunset = weather.daily?.sunset?.[0];

  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Daylight calculation
  let daylightDuration = '';
  if (sunrise && sunset) {
    const diffMs = new Date(sunset).getTime() - new Date(sunrise).getTime();
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      daylightDuration = `${hours}h ${mins}m of daylight`;
    }
  }

  const current = weather.current_weather;
  const hourly = weather.hourly;
  const currentHourlyIndex = 0;
  const apparentTemp = hourly?.apparent_temperature?.[currentHourlyIndex] ?? current.temperature;
  const humidity = hourly?.relative_humidity_2m?.[currentHourlyIndex] ?? 50;

  // Simple dew point approximation formula: Td ≈ T - ((100 - RH)/5)
  const dewPoint = current.temperature - (100 - humidity) / 5;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Gauge className="w-3.5 h-3.5" />
            <span>Environmental Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            Atmospheric Metrics
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sunrise & Sunset */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Sun Dynamics</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sunrise className="w-3.5 h-3.5 text-amber-300" /> Sunrise
              </span>
              <span className="font-mono text-slate-100 font-semibold">{formatSunTime(sunrise)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sunset className="w-3.5 h-3.5 text-orange-400" /> Sunset
              </span>
              <span className="font-mono text-slate-100 font-semibold">{formatSunTime(sunset)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            {daylightDuration || 'Solar cycle tracking'}
          </div>
        </div>

        {/* Feels Like & Dew Point */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Thermal Sensation</span>
            <Gauge className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-100">
              {formatTemperature(apparentTemp, unit)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dew point calculated at {formatTemperature(dewPoint, unit)}.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            {apparentTemp > current.temperature ? 'Feels warmer than actual' : 'Feels cooler with wind-chill'}
          </div>
        </div>

        {/* Elevation & Air Density */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Elevation Altitude</span>
            <Mountain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-100">
              {weather.elevation !== undefined ? `${Math.round(weather.elevation)} m` : 'Sea Level'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Topographic elevation above mean sea level.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            Geographic topography coordinate
          </div>
        </div>

        {/* Atmospheric Stability */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Atmospheric Airflow</span>
            <Wind className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-slate-100">
              {Math.round(current.windspeed)} <span className="text-sm font-normal text-slate-400">km/h</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Wind vector bearing: {Math.round(current.winddirection)}° azimuth.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            {current.windspeed > 25 ? 'Turbulent wind shear' : 'Laminar, stable airflow'}
          </div>
        </div>
      </div>
    </section>
  );
};
