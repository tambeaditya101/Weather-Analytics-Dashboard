export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

export const formatTemperature = (temp, unit = 'celsius') => {
  const temperature = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(temperature)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const getWeatherIconUrl = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};
