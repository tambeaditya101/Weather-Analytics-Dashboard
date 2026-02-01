import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchForecast } from '../features/weatherSlice';
import { formatTemperature, getWeatherIconUrl, formatTime, formatDate } from '../utils/weatherUtils';
import WeatherCharts from './WeatherCharts';
import './CityDetail.css';

const CityDetail = ({ city, onClose }) => {
  const dispatch = useDispatch();
  const forecast = useSelector(state => state.weather.forecasts[city.id]);
  const temperatureUnit = useSelector(state => state.settings.temperatureUnit);
  const loading = useSelector(state => state.weather.loading);

  useEffect(() => {
    dispatch(fetchForecast({ lat: city.coord.lat, lon: city.coord.lon }));
  }, [dispatch, city]);

  return (
    <div className="city-detail">
      <div className="city-detail-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="detail-header">
          <div className="header-info">
            <h1 className="detail-city-name">{city.name}, {city.country}</h1>
            <div className="current-weather">
              <img 
                src={getWeatherIconUrl(city.icon)} 
                alt={city.description}
                className="detail-weather-icon"
              />
              <div className="current-temp">
                {formatTemperature(city.temp, temperatureUnit)}
              </div>
            </div>
            <p className="detail-description">
              {city.description.charAt(0).toUpperCase() + city.description.slice(1)}
            </p>
          </div>
        </div>

        <div className="detailed-stats">
          <div className="stat-card">
            <span className="stat-icon">🌡️</span>
            <span className="stat-label">Feels Like</span>
            <span className="stat-value">
              {formatTemperature(city.feels_like, temperatureUnit)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💧</span>
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{city.humidity}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💨</span>
            <span className="stat-label">Wind Speed</span>
            <span className="stat-value">{city.wind_speed.toFixed(1)} m/s</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔽</span>
            <span className="stat-label">Pressure</span>
            <span className="stat-value">{city.pressure} hPa</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👁️</span>
            <span className="stat-label">Visibility</span>
            <span className="stat-value">{(city.visibility / 1000).toFixed(1)} km</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">☁️</span>
            <span className="stat-label">Cloudiness</span>
            <span className="stat-value">{city.clouds}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌅</span>
            <span className="stat-label">Sunrise</span>
            <span className="stat-value">{formatTime(city.sunrise)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌇</span>
            <span className="stat-label">Sunset</span>
            <span className="stat-value">{formatTime(city.sunset)}</span>
          </div>
        </div>

        {loading && !forecast && (
          <div className="loading-forecast">Loading forecast...</div>
        )}

        {forecast && (
          <>
            <section className="forecast-section">
              <h2>Hourly Forecast</h2>
              <div className="hourly-forecast">
                {forecast.hourly.map((hour, index) => (
                  <div key={index} className="hour-item">
                    <div className="hour-time">{formatTime(hour.dt)}</div>
                    <img 
                      src={getWeatherIconUrl(hour.icon)} 
                      alt={hour.description}
                      className="hour-icon"
                    />
                    <div className="hour-temp">
                      {formatTemperature(hour.temp, temperatureUnit)}
                    </div>
                    <div className="hour-detail">💧 {hour.humidity}%</div>
                    <div className="hour-detail">💨 {hour.wind_speed.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="forecast-section">
              <h2>7-Day Forecast</h2>
              <div className="daily-forecast">
                {forecast.daily.map((day, index) => (
                  <div key={index} className="day-item">
                    <div className="day-date">{formatDate(day.dt)}</div>
                    <img 
                      src={getWeatherIconUrl(day.icon)} 
                      alt={day.description}
                      className="day-icon"
                    />
                    <div className="day-temp">
                      <span className="temp-max">
                        {formatTemperature(day.temp_max, temperatureUnit)}
                      </span>
                      <span className="temp-min">
                        {formatTemperature(day.temp_min, temperatureUnit)}
                      </span>
                    </div>
                    <div className="day-description">{day.description}</div>
                    <div className="day-details">
                      <span>💧 {Math.round(day.humidity)}%</span>
                      <span>💨 {day.wind_speed.toFixed(1)} m/s</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="forecast-section">
              <h2>Weather Trends</h2>
              <WeatherCharts forecast={forecast} temperatureUnit={temperatureUnit} />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
