import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const ensureApiKey = () => {
  if (!API_KEY) {
    throw new Error(
      'Missing OpenWeatherMap API key. Set VITE_WEATHER_API_KEY in your .env file.'
    );
  }
  return API_KEY;
};

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 60000; // 60 seconds

const getCacheKey = (type, params) => {
  return `${type}_${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const fetchWeatherData = async (cityName, lat, lon) => {
  const cacheKey = getCacheKey('weather', { cityName, lat, lon });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const key = ensureApiKey();
    let url;
    if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
    } else {
      url = `${BASE_URL}/weather?q=${cityName}&appid=${key}&units=metric`;
    }

    const response = await axios.get(url);
    const data = response.data;

    const weatherData = {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      clouds: data.clouds.all,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      coord: data.coord,
    };

    setCachedData(cacheKey, weatherData);
    return weatherData;
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const status = error.response?.status;
    if (status === 401) {
      throw new Error(
        'OpenWeatherMap API Unauthorized (401). Check your VITE_WEATHER_API_KEY.'
      );
    }

    throw new Error(
      error.response?.data?.message || 'Failed to fetch weather data'
    );
  }
};

export const fetchForecastData = async (cityName, lat, lon) => {
  const cacheKey = getCacheKey('forecast', { cityName, lat, lon });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const key = ensureApiKey();
    let url;
    if (lat && lon) {
      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
    } else {
      url = `${BASE_URL}/forecast?q=${cityName}&appid=${key}&units=metric`;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Process hourly forecast (3-hour intervals)
    const hourlyForecast = data.list.slice(0, 8).map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      pressure: item.main.pressure,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      wind_speed: item.wind.speed,
      wind_deg: item.wind.deg,
      clouds: item.clouds.all,
      pop: item.pop, // probability of precipitation
      rain: item.rain?.['3h'] || 0,
    }));

    // Process daily forecast (group by day)
    const dailyMap = new Map();
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date).push(item);
    });

    const dailyForecast = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const humidities = items.map((i) => i.main.humidity);
        const windSpeeds = items.map((i) => i.wind.speed);
        const rains = items.map((i) => i.rain?.['3h'] || 0);

        return {
          date,
          dt: items[0].dt,
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          temp_avg: temps.reduce((a, b) => a + b, 0) / temps.length,
          humidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
          description:
            items[Math.floor(items.length / 2)].weather[0].description,
          icon: items[Math.floor(items.length / 2)].weather[0].icon,
          wind_speed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
          pop: Math.max(...items.map((i) => i.pop || 0)),
          rain: rains.reduce((a, b) => a + b, 0),
        };
      });

    const forecastData = {
      cityId: data.city.id,
      cityName: data.city.name,
      country: data.city.country,
      hourly: hourlyForecast,
      daily: dailyForecast,
    };

    setCachedData(cacheKey, forecastData);
    return forecastData;
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const status = error.response?.status;
    if (status === 401) {
      throw new Error(
        'OpenWeatherMap API Unauthorized (401). Check your VITE_WEATHER_API_KEY.'
      );
    }

    throw new Error(
      error.response?.data?.message || 'Failed to fetch weather data'
    );
  }
};

export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  const cacheKey = getCacheKey('search', { query });
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const key = ensureApiKey();
    const url = `${GEO_URL}/direct?q=${query}&limit=5&appid=${key}`;
    const response = await axios.get(url);

    const results = response.data.map((city) => ({
      id: `${city.lat}_${city.lon}`,
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    }));

    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const status = error.response?.status;
    if (status === 401) {
      throw new Error(
        'OpenWeatherMap API Unauthorized (401). Check your VITE_WEATHER_API_KEY.'
      );
    }

    throw new Error(
      error.response?.data?.message || 'Failed to fetch weather data'
    );
  }
};
