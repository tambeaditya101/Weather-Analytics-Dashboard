import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../features/weatherSlice';
import CityCard from './CityCard';
import CityDetail from './CityDetail';
import './Dashboard.css';

const DEFAULT_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
];

const Dashboard = ({ selectedCity }) => {
  const dispatch = useDispatch();
  const [detailCity, setDetailCity] = useState(null);
  const favorites = useSelector(state => state.settings.favorites);
  const currentWeather = useSelector(state => state.weather.currentWeather);
  const loading = useSelector(state => state.weather.loading);

  useEffect(() => {
    // Load default cities
    DEFAULT_CITIES.forEach(city => {
      dispatch(fetchWeather({ lat: city.lat, lon: city.lon }));
    });
  }, [dispatch]);

  useEffect(() => {
    // Load favorite cities
    favorites.forEach(fav => {
      dispatch(fetchWeather({ lat: fav.lat, lon: fav.lon }));
    });
  }, [favorites, dispatch]);

  useEffect(() => {
    // Load selected city from search
    if (selectedCity) {
      dispatch(fetchWeather({ lat: selectedCity.lat, lon: selectedCity.lon }));
    }
  }, [selectedCity, dispatch]);

  // Refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const citiesToRefresh = [...DEFAULT_CITIES, ...favorites];
      citiesToRefresh.forEach(city => {
        dispatch(fetchWeather({ lat: city.lat, lon: city.lon }));
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, favorites]);

  const weatherData = Object.values(currentWeather);

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
    <div className="dashboard">
      <div className="dashboard-content">
        {loading && weatherData.length === 0 && (
          <div className="loading">Loading weather data...</div>
        )}

        <div className="city-grid">
          {weatherData.map((weather) => (
            <CityCard
              key={weather.id}
              weather={weather}
              onClick={() => handleCityClick(weather)}
            />
          ))}
        </div>

        {weatherData.length === 0 && !loading && (
          <div className="no-data">
            <p>No cities to display. Search and add cities to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
