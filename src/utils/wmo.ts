export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'CloudSnow' | 'CloudHail';
  color: string;
  bgGradient: string;
}

export function getWMOInterpretation(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: 'Sunny and completely cloudless conditions',
        iconName: 'Sun',
        color: 'text-amber-400',
        bgGradient: 'from-amber-500/20 via-sky-500/10 to-transparent',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Mainly clear with sparse high clouds',
        iconName: 'CloudSun',
        color: 'text-amber-300',
        bgGradient: 'from-sky-500/20 via-indigo-500/10 to-transparent',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with intermittent sunshine',
        iconName: 'CloudSun',
        color: 'text-sky-300',
        bgGradient: 'from-sky-500/20 via-slate-700/10 to-transparent',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Uniform dense cloud cover across the sky',
        iconName: 'Cloud',
        color: 'text-slate-300',
        bgGradient: 'from-slate-600/30 via-slate-800/10 to-transparent',
      };
    case 45:
      return {
        code,
        label: 'Foggy',
        description: 'Dense fog reducing horizon visibility',
        iconName: 'CloudFog',
        color: 'text-zinc-400',
        bgGradient: 'from-zinc-500/20 via-slate-800/10 to-transparent',
      };
    case 48:
      return {
        code,
        label: 'Rime Fog',
        description: 'Depositing rime fog with icy atmospheric moisture',
        iconName: 'CloudFog',
        color: 'text-cyan-300',
        bgGradient: 'from-cyan-600/20 via-slate-800/10 to-transparent',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        description: 'Very light misty precipitation',
        iconName: 'CloudDrizzle',
        color: 'text-teal-300',
        bgGradient: 'from-teal-600/20 via-slate-800/10 to-transparent',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        description: 'Steady fine drizzle droplets',
        iconName: 'CloudDrizzle',
        color: 'text-teal-400',
        bgGradient: 'from-teal-600/20 via-slate-800/10 to-transparent',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        description: 'Heavy damp drizzle with reduced road traction',
        iconName: 'CloudDrizzle',
        color: 'text-teal-500',
        bgGradient: 'from-teal-700/20 via-slate-800/10 to-transparent',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Freezing drizzle causing slick surfaces',
        iconName: 'CloudSnow',
        color: 'text-cyan-300',
        bgGradient: 'from-cyan-700/20 via-slate-800/10 to-transparent',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        description: 'Light scattered rainfall',
        iconName: 'CloudRain',
        color: 'text-blue-400',
        bgGradient: 'from-blue-600/20 via-sky-900/10 to-transparent',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Steady rainfall across the area',
        iconName: 'CloudRain',
        color: 'text-blue-500',
        bgGradient: 'from-blue-700/25 via-indigo-900/15 to-transparent',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense continuous downpour and water accumulation',
        iconName: 'CloudRain',
        color: 'text-blue-400',
        bgGradient: 'from-blue-800/30 via-slate-900/20 to-transparent',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Liquid precipitation freezing on cold ground contacts',
        iconName: 'CloudSnow',
        color: 'text-sky-300',
        bgGradient: 'from-sky-700/25 via-indigo-900/15 to-transparent',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow',
        description: 'Light flurries and gentle snowflakes',
        iconName: 'CloudSnow',
        color: 'text-sky-200',
        bgGradient: 'from-sky-400/20 via-indigo-900/15 to-transparent',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        description: 'Steady snowfall building ground coverage',
        iconName: 'CloudSnow',
        color: 'text-sky-100',
        bgGradient: 'from-sky-300/20 via-indigo-900/15 to-transparent',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow',
        description: 'Vigorous snowfall with hazardous travel conditions',
        iconName: 'CloudSnow',
        color: 'text-white',
        bgGradient: 'from-slate-200/25 via-slate-800/20 to-transparent',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Small, granular opaque ice particles',
        iconName: 'CloudSnow',
        color: 'text-cyan-200',
        bgGradient: 'from-cyan-400/20 via-slate-800/15 to-transparent',
      };
    case 80:
      return {
        code,
        label: 'Passing Showers',
        description: 'Short bursts of brief showers',
        iconName: 'CloudRain',
        color: 'text-blue-400',
        bgGradient: 'from-blue-500/20 via-indigo-900/10 to-transparent',
      };
    case 81:
      return {
        code,
        label: 'Moderate Showers',
        description: 'Frequent sudden rain showers',
        iconName: 'CloudRain',
        color: 'text-blue-500',
        bgGradient: 'from-blue-600/25 via-indigo-900/15 to-transparent',
      };
    case 82:
      return {
        code,
        label: 'Violent Showers',
        description: 'Torrential torrential cloudburst showers',
        iconName: 'CloudRain',
        color: 'text-indigo-400',
        bgGradient: 'from-indigo-700/30 via-slate-900/25 to-transparent',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Intermittent heavy snow bursts with wind gusts',
        iconName: 'CloudSnow',
        color: 'text-sky-200',
        bgGradient: 'from-sky-400/20 via-indigo-950/20 to-transparent',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Active electrical lightning with gusty thunder winds',
        iconName: 'CloudLightning',
        color: 'text-amber-400',
        bgGradient: 'from-amber-600/25 via-purple-950/30 to-transparent',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Hailstorm',
        description: 'Violent thunderstorm accompanied by falling hailstones',
        iconName: 'CloudHail',
        color: 'text-amber-300',
        bgGradient: 'from-purple-800/35 via-rose-950/25 to-transparent',
      };
    default:
      return {
        code,
        label: 'Cloudy',
        description: 'Variable cloud cover and atmospheric pressure',
        iconName: 'Cloud',
        color: 'text-slate-300',
        bgGradient: 'from-slate-700/20 via-slate-900/10 to-transparent',
      };
  }
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTemperatureValue(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: 'kmh' | 'mph'): string {
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
