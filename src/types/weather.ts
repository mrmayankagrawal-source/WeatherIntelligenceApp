export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day?: number;
}

export interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weathercode: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  uv_index?: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: DailyWeather;
  hourly?: HourlyWeather;
  elevation?: number;
}

export interface SmartRecommendation {
  id: string;
  category: 'clothing' | 'umbrella' | 'outdoor' | 'caution' | 'activity';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  icon: string;
}

export interface ActivityRating {
  name: string;
  score: 'ideal' | 'good' | 'fair' | 'poor';
  summary: string;
}
