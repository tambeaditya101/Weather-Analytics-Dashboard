import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/settingsSlice';
import { formatTemperature, getWeatherIconUrl } from '../utils/weatherUtils';
import './CityCard.css';

const CityCard = ({ weather, onClick }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.settings.favorites);
  const temperatureUnit = useSelector(state => state.settings.temperatureUnit);
  
  const isFavorite = favorites.some(fav => fav.id === weather.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(weather.id));
    } else {
      dispatch(addFavorite({
        id: weather.id,
        name: weather.name,
        country: weather.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      }));
    }
  };

  return (
    <div className="city-card" onClick={onClick}>
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <div className="city-header">
        <h2 className="city-name">{weather.name}</h2>
        <span className="country">{weather.country}</span>
      </div>

      <div className="weather-main">
        <img 
          src={getWeatherIconUrl(weather.icon)} 
          alt={weather.description}
          className="weather-icon"
        />
        <div className="temperature">
          {formatTemperature(weather.temp, temperatureUnit)}
        </div>
      </div>

      <div className="weather-description">
        {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.wind_speed.toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
