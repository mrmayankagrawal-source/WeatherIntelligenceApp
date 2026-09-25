import { GeoLocationResult, WeatherData } from '../types/weather';

export async function searchCities(cityName: string, count: number = 5): Promise<GeoLocationResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
    }));
  } catch (err: any) {
    console.error('Error fetching geocoding results:', err);
    throw new Error(err.message || 'Unable to connect to geocoding service. Please check your internet connection.');
  }
}

export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    hourly: 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,wind_speed_10m,relative_humidity_2m,uv_index',
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather forecast service returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data.current_weather) {
      throw new Error('Incomplete meteorological data received.');
    }

    return data as WeatherData;
  } catch (err: any) {
    console.error('Error fetching weather forecast:', err);
    throw new Error(err.message || 'Failed to retrieve meteorological forecast data.');
  }
}

export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoLocationResult> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      return {
        id: Math.round(lat * 1000 + lon),
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        latitude: lat,
        longitude: lon,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding fallback failed, using coordinates label', e);
  }

  return {
    id: Math.round(lat * 1000 + lon),
    name: 'Current Coordinates',
    latitude: lat,
    longitude: lon,
    country: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
  };
}
