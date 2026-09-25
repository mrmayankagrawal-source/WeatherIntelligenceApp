import React from 'react';
import {
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Footprints,
  Bike,
  UtensilsCrossed,
  Layers,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { generateSmartRecommendations, evaluateActivitySuitability } from '../utils/recommendations';
import { WeatherIcon } from './WeatherIcon';

interface SmartRecommendationsProps {
  weather: WeatherData;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ weather }) => {
  const recommendations = generateSmartRecommendations(weather);
  const activities = evaluateActivitySuitability(weather);

  const getUrgencyAccent = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high':
        return {
          border: 'border-amber-500/40 bg-amber-500/5',
          iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        };
      case 'medium':
        return {
          border: 'border-sky-500/30 bg-sky-500/5',
          iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
        };
      case 'low':
      default:
        return {
          border: 'border-slate-800 bg-slate-900/60',
          iconBg: 'bg-slate-800 text-slate-300 border border-slate-700/50',
        };
    }
  };

  const getActivityScoreDisplay = (score: 'ideal' | 'good' | 'fair' | 'poor') => {
    switch (score) {
      case 'ideal':
        return { text: 'Optimal Conditions', color: 'text-emerald-400' };
      case 'good':
        return { text: 'Favorable', color: 'text-sky-400' };
      case 'fair':
        return { text: 'Moderate / Caution', color: 'text-amber-400' };
      case 'poor':
        return { text: 'Not Recommended', color: 'text-rose-400' };
    }
  };

  const getActivityIcon = (name: string) => {
    if (name.includes('Running')) return <Footprints className="w-4 h-4 text-sky-400" />;
    if (name.includes('Cycling')) return <Bike className="w-4 h-4 text-teal-400" />;
    return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Context-Aware Meteorological Advisory</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-0.5">
            Smart Planning Recommendations
          </h2>
        </div>
      </div>

      {/* Primary Contextual Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const accent = getUrgencyAccent(rec.urgency);
          return (
            <div
              key={rec.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all hover:border-slate-700/80 ${accent.border}`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${accent.iconBg}`}>
                    <WeatherIcon name={rec.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{rec.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="capitalize">{rec.category} Guidance</span>
                <span className="text-slate-400">
                  {rec.urgency === 'high' ? 'High Attention' : rec.urgency === 'medium' ? 'Advisory' : 'General'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Suitability Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200">Outdoor Activity Suitability Index</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activities.map((act) => {
            const scoreInfo = getActivityScoreDisplay(act.score);
            return (
              <div
                key={act.name}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                      {getActivityIcon(act.name)}
                      {act.name}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold ${scoreInfo.color} font-mono mb-1`}>
                    {scoreInfo.text}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{act.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
