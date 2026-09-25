import React from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 h-72">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-800 rounded"></div>
            <div className="h-8 w-56 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-4 w-40 bg-slate-800 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          <div className="md:col-span-7 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-800"></div>
            <div className="space-y-3">
              <div className="h-12 w-36 bg-slate-800 rounded-lg"></div>
              <div className="h-4 w-48 bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-800/60"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl border border-slate-800 bg-slate-900/40 p-4"></div>
        ))}
      </div>

      {/* 7-day skeleton */}
      <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/40 p-6"></div>
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  searchedCity?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, searchedCity }) => {
  return (
    <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-8 text-center max-w-xl mx-auto my-12 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">Meteorological Lookup Failed</h3>
      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
        {message}
      </p>
      {searchedCity && (
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Query: "{searchedCity}"
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
