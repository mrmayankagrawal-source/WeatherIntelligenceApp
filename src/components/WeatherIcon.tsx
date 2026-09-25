import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
  Umbrella,
  Wind,
  Droplets,
  Thermometer,
  EyeOff,
  Flame,
  Shirt,
  Smile,
  Compass,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} size={size} />;
    case 'CloudSun':
      return <CloudSun className={className} size={size} />;
    case 'Cloud':
      return <Cloud className={className} size={size} />;
    case 'CloudFog':
      return <CloudFog className={className} size={size} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} size={size} />;
    case 'CloudRain':
      return <CloudRain className={className} size={size} />;
    case 'CloudSnow':
      return <CloudSnow className={className} size={size} />;
    case 'CloudLightning':
      return <CloudLightning className={className} size={size} />;
    case 'CloudHail':
      return <CloudHail className={className} size={size} />;
    case 'Umbrella':
      return <Umbrella className={className} size={size} />;
    case 'Wind':
      return <Wind className={className} size={size} />;
    case 'Droplets':
      return <Droplets className={className} size={size} />;
    case 'Thermometer':
    case 'ThermometerSnowflake':
      return <Thermometer className={className} size={size} />;
    case 'EyeOff':
      return <EyeOff className={className} size={size} />;
    case 'Flame':
      return <Flame className={className} size={size} />;
    case 'Shirt':
      return <Shirt className={className} size={size} />;
    case 'Smile':
      return <Smile className={className} size={size} />;
    case 'Compass':
      return <Compass className={className} size={size} />;
    default:
      return <Cloud className={className} size={size} />;
  }
};
