import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/settingsSlice';
import { formatTemperature, getWeatherIconUrl } from '../utils/weatherUtils';
import './CityCard.css';

const CityCard = ({ weather, onClick }) => {
  const dispatch = useDispatch();
  // select each value separately to avoid returning a new object each render
  const favorites = useSelector((state) => state.settings.favorites);
  const temperatureUnit = useSelector(
    (state) => state.settings.temperatureUnit
  );

  const isFavorite = useMemo(
    () => favorites.some((fav) => fav.id === weather?.id),
    [favorites, weather?.id]
  );

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!weather) return;

    if (isFavorite) {
      dispatch(removeFavorite(weather.id));
    } else {
      dispatch(
        addFavorite({
          id: weather.id,
          name: weather.name || weather.city || 'Unknown',
          country: weather.country || weather.sys?.country || '',
          lat: weather.coord?.lat ?? weather.lat,
          lon: weather.coord?.lon ?? weather.lon,
        })
      );
    }
  };

  const displayName = weather?.name || weather?.city || 'Unknown';
  const country = weather?.country || weather?.sys?.country || '';
  const iconCode = weather?.icon || weather?.weather?.[0]?.icon;
  const description =
    weather?.description || weather?.weather?.[0]?.description || '';
  const temp = weather?.temp ?? weather?.main?.temp;
  const humidity = weather?.humidity ?? weather?.main?.humidity;
  const windSpeed = weather?.wind_speed ?? weather?.wind?.speed ?? 0;

  return (
    <div className='city-card' onClick={onClick} role='button' tabIndex={0}>
      <button
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-pressed={isFavorite}
        title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
      >
        <span aria-hidden>{isFavorite ? '★' : '☆'}</span>
      </button>

      <div className='city-header'>
        <div className='name-wrap'>
          <h3 className='city-name'>{displayName}</h3>
          {country && <span className='country'>{country}</span>}
        </div>
      </div>

      <div className='weather-main'>
        <img
          src={getWeatherIconUrl(iconCode)}
          alt={description || displayName}
          className='weather-icon'
          loading='lazy'
        />
        <div className='temperature' title={`${temp}°`}>
          {formatTemperature(temp, temperatureUnit)}
        </div>
      </div>

      {description && (
        <div className='weather-description'>
          {description.charAt(0).toUpperCase() + description.slice(1)}
        </div>
      )}

      <div className='weather-details'>
        <div className='detail-item'>
          <span className='detail-icon' aria-hidden>
            💧
          </span>
          <span className='detail-label'>Humidity</span>
          <span className='detail-value'>{humidity ?? '—'}%</span>
        </div>
        <div className='detail-item'>
          <span className='detail-icon' aria-hidden>
            💨
          </span>
          <span className='detail-label'>Wind</span>
          <span className='detail-value'>
            {(windSpeed || 0).toFixed(1)} m/s
          </span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
