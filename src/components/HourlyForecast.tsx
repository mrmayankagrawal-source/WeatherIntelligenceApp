import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { getWMOInterpretation, formatTemperature } from '../utils/wmo';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly?: HourlyWeather;
  currentTimeString?: string;
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  currentTimeString,
  unit,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Find start index matching current hour or slice next 24 hours
  let startIndex = 0;
  if (currentTimeString) {
    const currentPrefix = currentTimeString.slice(0, 13);
    const found = hourly.time.findIndex((t) => t.startsWith(currentPrefix));
    if (found !== -1) startIndex = found;
  }

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header with scroll controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>24-Hour Horizon</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            Hourly Atmosphere
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly Cards Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
      >
        {next24Hours.map((timeStr, idx) => {
          const globalIdx = startIndex + idx;
          const date = new Date(timeStr);
          const isNow = idx === 0;

          const hourLabel = isNow
            ? 'Now'
            : date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

          const temp = hourly.temperature_2m[globalIdx];
          const code = hourly.weathercode[globalIdx];
          const rainProb = hourly.precipitation_probability?.[globalIdx] ?? 0;
          const windSpeed = hourly.wind_speed_10m?.[globalIdx] ?? 0;

          // Determine if day or night approximately from hour
          const hourNum = date.getHours();
          const isDayTime = hourNum >= 6 && hourNum < 20;
          const condition = getWMOInterpretation(code, isDayTime);

          return (
            <div
              key={timeStr}
              className={`flex-none w-[110px] p-3.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                isNow
                  ? 'bg-sky-500/10 border-sky-500/40 shadow-md shadow-sky-950/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-mono font-medium text-slate-300">
                {hourLabel}
              </div>

              <div className="my-2.5">
                <WeatherIcon
                  name={condition.iconName}
                  className={`w-6 h-6 mx-auto ${condition.color}`}
                />
              </div>

              <div className="text-sm font-bold font-mono text-slate-100">
                {formatTemperature(temp, unit)}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 w-full flex items-center justify-center gap-1 text-[11px] font-mono text-slate-400">
                {rainProb > 0 ? (
                  <span className="text-sky-400 flex items-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    {rainProb}%
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <Wind className="w-3 h-3" />
                    {Math.round(windSpeed)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
