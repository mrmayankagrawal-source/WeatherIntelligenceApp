import { WeatherData, SmartRecommendation, ActivityRating } from '../types/weather';

export function generateSmartRecommendations(weather: WeatherData): SmartRecommendation[] {
  const currentTemp = weather.current_weather.temperature;
  const currentCode = weather.current_weather.weathercode;
  const currentWind = weather.current_weather.windspeed;
  
  // Calculate today's precipitation sum and max UV from daily data
  const todayPrecip = weather.daily.precipitation_sum?.[0] ?? 0;
  const maxUV = weather.daily.uv_index_max?.[0] ?? 0;
  const precipProb = weather.daily.precipitation_probability_max?.[0] ?? 0;

  const recommendations: SmartRecommendation[] = [];

  // 1. Precipitation & Umbrella Recommendations
  const isRainingNow = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(currentCode);
  const isSnowingNow = [71, 73, 75, 77, 85, 86].includes(currentCode);

  if (isRainingNow || todayPrecip > 0.5 || precipProb > 40) {
    recommendations.push({
      id: 'umbrella',
      category: 'umbrella',
      title: 'Bring an Umbrella or Rain Shell',
      description: isRainingNow
        ? `Active rainfall detected in the area. Keep a reliable umbrella handy for any outings.`
        : `Forecast calls for up to ${todayPrecip.toFixed(1)} mm precipitation (${precipProb}% probability). Pack rain protection before heading out.`,
      urgency: isRainingNow ? 'high' : 'medium',
      icon: 'Umbrella',
    });
  } else if (isSnowingNow || (todayPrecip > 0 && currentTemp <= 1)) {
    recommendations.push({
      id: 'snow-gear',
      category: 'caution',
      title: 'Snow & Ice Preparedness',
      description: 'Snow flurries or ground accumulation expected. Wear waterproof boots with good grip tread.',
      urgency: 'high',
      icon: 'Footprints',
    });
  } else {
    recommendations.push({
      id: 'no-rain',
      category: 'umbrella',
      title: 'No Umbrella Required',
      description: 'Precipitation probability remains negligible throughout today. Dry outdoor conditions expected.',
      urgency: 'low',
      icon: 'Sun',
    });
  }

  // 2. Temperature & Layering Recommendations
  if (currentTemp < 0) {
    recommendations.push({
      id: 'subzero-layers',
      category: 'clothing',
      title: 'Heavy Thermal Insulation Needed',
      description: `Freezing temperature (${Math.round(currentTemp)}°C). Wear thermal base layers, a heavy insulated coat, insulated gloves, and a beanie.`,
      urgency: 'high',
      icon: 'ThermometerSnowflake',
    });
  } else if (currentTemp < 10) {
    recommendations.push({
      id: 'cold-layers',
      category: 'clothing',
      title: 'Wear Warm Layers & Jacket',
      description: `Chilly conditions at ${Math.round(currentTemp)}°C. A wool sweater, fleece mid-layer, or wind-resistant overcoat is advised.`,
      urgency: 'medium',
      icon: 'Shirt',
    });
  } else if (currentTemp <= 18) {
    recommendations.push({
      id: 'mild-layers',
      category: 'clothing',
      title: 'Light Outerwear or Cardigan',
      description: `Mild atmospheric air (${Math.round(currentTemp)}°C). A breathable light jacket, hoodie, or denim jacket will keep you comfortable.`,
      urgency: 'low',
      icon: 'Shirt',
    });
  } else if (currentTemp <= 26) {
    recommendations.push({
      id: 'comfortable-clothing',
      category: 'clothing',
      title: 'Comfortable T-Shirt & Light Attire',
      description: `Optimal comfort range (${Math.round(currentTemp)}°C). Short sleeves, natural breathable cottons, or linen are ideal.`,
      urgency: 'low',
      icon: 'Sparkles',
    });
  } else {
    recommendations.push({
      id: 'hot-weather',
      category: 'clothing',
      title: 'Heat Advisory: Stay Hydrated & Cool',
      description: `Warm to hot conditions (${Math.round(currentTemp)}°C). Choose loose, light-colored clothing and keep cold water accessible.`,
      urgency: 'high',
      icon: 'Flame',
    });
  }

  // 3. Outdoor & Leisure Weather Assessment
  const isSunnyOrClear = [0, 1].includes(currentCode);
  const isPartlyCloudy = currentCode === 2;

  if (isSunnyOrClear && currentTemp >= 16 && currentTemp <= 27 && currentWind < 20 && todayPrecip === 0) {
    recommendations.push({
      id: 'outdoor-prime',
      category: 'outdoor',
      title: 'Great Outdoor Weather',
      description: 'Crisp, clear skies and moderate breezes create peak conditions for outdoor recreation, terrace dining, or park strolls.',
      urgency: 'low',
      icon: 'Smile',
    });
  } else if ([45, 48].includes(currentCode)) {
    recommendations.push({
      id: 'fog-caution',
      category: 'caution',
      title: 'Reduced Driving Visibility',
      description: 'Dense fog layers are lingering. Use low-beam headlights and maintain extra following distance on highways.',
      urgency: 'medium',
      icon: 'EyeOff',
    });
  }

  // 4. Wind Alert
  if (currentWind >= 35) {
    recommendations.push({
      id: 'high-wind',
      category: 'caution',
      title: 'Strong Gusts & Wind Advisory',
      description: `Brisk winds clocked at ${Math.round(currentWind)} km/h. Secure loose outdoor furniture, balconies, and wear a hooded windbreaker.`,
      urgency: 'high',
      icon: 'Wind',
    });
  } else if (currentWind >= 22) {
    recommendations.push({
      id: 'moderate-wind',
      category: 'caution',
      title: 'Noticeable Wind Drafts',
      description: `Wind speed around ${Math.round(currentWind)} km/h. Cycling headwind may be noticeable; carry a windproof shell.`,
      urgency: 'low',
      icon: 'Wind',
    });
  }

  // 5. UV Radiation Alert
  if (maxUV >= 6) {
    recommendations.push({
      id: 'uv-alert',
      category: 'caution',
      title: `High UV Index (${maxUV.toFixed(1)})`,
      description: 'Solar radiation is elevated during midday hours. Apply SPF 30+ sunscreen, wear UV400 sunglasses, and seek shade.',
      urgency: maxUV >= 8 ? 'high' : 'medium',
      icon: 'SunDim',
    });
  }

  return recommendations;
}

export function evaluateActivitySuitability(weather: WeatherData): ActivityRating[] {
  const temp = weather.current_weather.temperature;
  const wind = weather.current_weather.windspeed;
  const code = weather.current_weather.weathercode;
  const precip = weather.daily.precipitation_sum?.[0] ?? 0;
  const isWet = precip > 0.5 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

  const activities: ActivityRating[] = [];

  // Running & Jogging
  if (isWet) {
    activities.push({
      name: 'Running & Cardio',
      score: 'poor',
      summary: 'Wet or slick pavements with active or impending precipitation.',
    });
  } else if (temp >= 10 && temp <= 22 && wind < 25) {
    activities.push({
      name: 'Running & Cardio',
      score: 'ideal',
      summary: 'Near-optimal thermal balance for aerobic endurance training.',
    });
  } else if (temp > 28 || temp < 2) {
    activities.push({
      name: 'Running & Cardio',
      score: 'fair',
      summary: temp > 28 ? 'High heat load; hydrate frequently.' : 'Cold air; warm up thoroughly.',
    });
  } else {
    activities.push({
      name: 'Running & Cardio',
      score: 'good',
      summary: 'Pleasant conditions with manageable ambient resistance.',
    });
  }

  // Cycling & Commuting
  if (wind > 35 || isWet) {
    activities.push({
      name: 'Cycling & Micro-mobility',
      score: 'poor',
      summary: isWet ? 'Slick road striping and reduced braking friction.' : 'Strong side gusts compromising bike stability.',
    });
  } else if (wind > 20) {
    activities.push({
      name: 'Cycling & Micro-mobility',
      score: 'fair',
      summary: 'Noticeable crosswinds and headwinds on open roadways.',
    });
  } else if (temp >= 12 && temp <= 26 && !isWet) {
    activities.push({
      name: 'Cycling & Micro-mobility',
      score: 'ideal',
      summary: 'Calm air with dry asphalt, ideal for commuting or leisure rides.',
    });
  } else {
    activities.push({
      name: 'Cycling & Micro-mobility',
      score: 'good',
      summary: 'Fairly comfortable cycling weather with normal precautions.',
    });
  }

  // Outdoor Dining & Terraces
  if (isWet || temp < 14 || wind > 25) {
    activities.push({
      name: 'Patio & Outdoor Dining',
      score: isWet || temp < 10 ? 'poor' : 'fair',
      summary: isWet ? 'Unfavorable due to precipitation.' : 'Breezy or cool; outdoor heaters recommended.',
    });
  } else if (temp >= 18 && temp <= 26 && wind < 15) {
    activities.push({
      name: 'Patio & Outdoor Dining',
      score: 'ideal',
      summary: 'Golden patio conditions with gentle air movement and mild temperatures.',
    });
  } else {
    activities.push({
      name: 'Patio & Outdoor Dining',
      score: 'good',
      summary: 'Pleasant for dining al fresco with a light layer.',
    });
  }

  return activities;
}
