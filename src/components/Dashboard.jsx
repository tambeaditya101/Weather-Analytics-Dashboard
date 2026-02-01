import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../features/weatherSlice';
import CityCard from './CityCard';
import CityDetail from './CityDetail';
import './Dashboard.css';

const DEFAULT_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
];

const Dashboard = ({ selectedCity }) => {
  const dispatch = useDispatch();
  const [detailCity, setDetailCity] = useState(null);

  // Consolidated selector to reduce multiple subscriptions
  const { favorites, currentWeather, loading } = useSelector((state) => ({
    favorites: state.settings.favorites,
    currentWeather: state.weather.currentWeather,
    loading: state.weather.loading,
  }));

  // Helper: dedupe cities by lat/lon (string key)
  const uniqueByLatLon = (cities = []) => {
    const map = new Map();
    cities.forEach((c) => {
      if (c && c.lat !== undefined && c.lon !== undefined) {
        const key = `${Number(c.lat).toFixed(6)}:${Number(c.lon).toFixed(6)}`;
        if (!map.has(key)) map.set(key, c);
      }
    });
    return Array.from(map.values());
  };

  // Function to dispatch fetch for a list of city objects
  const fetchForCities = (cities) => {
    cities.forEach((city) => {
      dispatch(fetchWeather({ lat: city.lat, lon: city.lon }));
    });
  };

  // Single effect: initial load + react to favorites/selectedCity + refresh interval
  useEffect(() => {
    const cities = [
      ...DEFAULT_CITIES,
      ...(Array.isArray(favorites) ? favorites : []),
    ];

    if (
      selectedCity &&
      selectedCity.lat !== undefined &&
      selectedCity.lon !== undefined
    ) {
      cities.push(selectedCity);
    }

    const toFetch = uniqueByLatLon(cities);
    fetchForCities(toFetch);

    // set up refresh interval
    const refresh = () => {
      // refresh the same deduped set
      fetchForCities(toFetch);
    };

    const interval = setInterval(refresh, 60000); // 60s
    return () => clearInterval(interval);
  }, [dispatch, favorites, selectedCity]);

  const weatherData = useMemo(
    () => Object.values(currentWeather || {}),
    [currentWeather]
  );

  const handleCityClick = (weather) => {
    setDetailCity(weather);
  };

  const handleCloseDetail = () => {
    setDetailCity(null);
  };

  if (detailCity) {
    return <CityDetail city={detailCity} onClose={handleCloseDetail} />;
  }

  return (
    <div className='dashboard'>
      <div className='dashboard-content'>
        {loading && weatherData.length === 0 && (
          <div className='loading'>Loading weather data...</div>
        )}

        <div className='city-grid'>
          {weatherData.map((weather) => (
            <CityCard
              key={weather.id}
              weather={weather}
              onClick={() => handleCityClick(weather)}
            />
          ))}
        </div>

        {weatherData.length === 0 && !loading && (
          <div className='no-data'>
            <p>No cities to display. Search and add cities to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
