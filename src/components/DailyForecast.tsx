import React, { useState } from 'react';
import { Calendar, Droplets, Wind, ChevronRight, SunMedium } from 'lucide-react';
import { DailyWeather, TemperatureUnit } from '../types/weather';
import { getWMOInterpretation, formatTemperature, formatTemperatureValue } from '../utils/wmo';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyWeather;
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate absolute min & max temperatures across the 7 days to size thermal range bars
  const allMaxValues = daily.temperature_2m_max.map((t) => formatTemperatureValue(t, unit));
  const allMinValues = daily.temperature_2m_min.map((t) => formatTemperatureValue(t, unit));
  const absoluteWeekMax = Math.max(...allMaxValues);
  const absoluteWeekMin = Math.min(...allMinValues);
  const rangeSpan = Math.max(1, absoluteWeekMax - absoluteWeekMin);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>Meteorological Outlook</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            7-Day Forecast
          </h2>
        </div>
      </div>

      {/* 7-Day List/Grid Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80 overflow-hidden shadow-lg backdrop-blur-sm">
        {daily.time.slice(0, 7).map((dateStr, index) => {
          const date = new Date(dateStr + 'T00:00:00');
          const isToday = index === 0;
          const isTomorrow = index === 1;

          let dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          if (isToday) dayLabel = 'Today';
          else if (isTomorrow) dayLabel = 'Tomorrow';

          const formattedDayNumber = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const weatherCode = daily.weathercode[index];
          const condition = getWMOInterpretation(weatherCode, true);
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const precipSum = daily.precipitation_sum?.[index] ?? 0;
          const precipProb = daily.precipitation_probability_max?.[index] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[index] ?? 0;

          // Relative range calculation for the visual temperature bar
          const minVal = formatTemperatureValue(minTemp, unit);
          const maxVal = formatTemperatureValue(maxTemp, unit);
          const leftPercent = Math.max(0, Math.min(100, ((minVal - absoluteWeekMin) / rangeSpan) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxVal - minVal) / rangeSpan) * 100));

          const isSelected = selectedDayIndex === index;

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDayIndex(index)}
              className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelected ? 'bg-slate-800/30' : ''
              }`}
            >
              {/* Day & Date info */}
              <div className="flex items-center gap-4 min-w-[170px]">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                  <WeatherIcon name={condition.iconName} className={`w-5 h-5 ${condition.color}`} />
                </div>
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5 text-sm">
                    <span>{dayLabel}</span>
                    {isToday && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{formattedDayNumber}</div>
                </div>
              </div>

              {/* Condition Title & Precipitation */}
              <div className="flex items-center justify-between md:justify-start gap-4 flex-1">
                <div className="text-xs text-slate-300 font-medium md:min-w-[140px]">
                  {condition.label}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  {precipSum > 0 ? (
                    <div className="flex items-center gap-1 text-sky-400">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>
                        {precipSum.toFixed(1)} mm ({precipProb}%)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 opacity-40" />
                      <span>0.0 mm</span>
                    </div>
                  )}

                  {windMax > 0 && (
                    <div className="hidden sm:flex items-center gap-1 text-slate-400">
                      <Wind className="w-3.5 h-3.5" />
                      <span>{Math.round(windMax)} km/h</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Temperature Bar & Figures */}
              <div className="flex items-center gap-3 min-w-[240px] justify-end">
                <span className="text-xs font-mono text-cyan-300 w-10 text-right">
                  {formatTemperature(minTemp, unit)}
                </span>

                {/* Relative thermal gradient bar */}
                <div className="relative h-2 w-28 sm:w-36 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-mono text-rose-300 font-semibold w-10 text-left">
                  {formatTemperature(maxTemp, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
