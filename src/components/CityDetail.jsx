import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForecast } from '../features/weatherSlice';
import {
  formatDate,
  formatTemperature,
  formatTime,
  getWeatherIconUrl,
} from '../utils/weatherUtils';
import './CityDetail.css';
import WeatherCharts from './WeatherCharts';

const CityDetail = ({ city, onClose }) => {
  const dispatch = useDispatch();

  // Use separate selectors to avoid returning a new object each render
  const forecasts = useSelector((state) => state.weather.forecasts);
  const temperatureUnit = useSelector(
    (state) => state.settings.temperatureUnit
  );
  const loading = useSelector((state) => state.weather.loading);

  // pick forecast for this city id (safe if city is undefined)
  const forecast = city?.id ? forecasts?.[city.id] : undefined;

  // Defensive effect: only fetch when coords exist
  useEffect(() => {
    const lat = city?.coord?.lat ?? city?.lat;
    const lon = city?.coord?.lon ?? city?.lon;
    if (lat !== undefined && lon !== undefined) {
      dispatch(fetchForecast({ lat, lon }));
    }
  }, [dispatch, city?.coord?.lat, city?.coord?.lon, city?.lat, city?.lon]);

  // Memoized safe values
  const display = useMemo(() => {
    const name = city?.name ?? city?.city ?? 'Unknown';
    const country = city?.country ?? city?.sys?.country ?? '';
    const icon = city?.icon ?? city?.weather?.[0]?.icon;
    const desc = (
      city?.description ??
      city?.weather?.[0]?.description ??
      ''
    ).toLowerCase();
    return { name, country, icon, desc };
  }, [city]);

  const hourly = forecast?.hourly ?? [];
  const daily = forecast?.daily ?? [];

  return (
    <div
      className='city-detail'
      role='dialog'
      aria-modal='true'
      aria-label={`${display.name} details`}
    >
      <div className='city-detail-backdrop' onClick={onClose} />
      <div className='city-detail-content' tabIndex={-1}>
        <button
          className='detail-close-btn'
          onClick={onClose}
          aria-label='Close city details'
        >
          <svg
            viewBox='0 0 24 24'
            aria-hidden='true'
            focusable='false'
            role='img'
          >
            <line x1='6' y1='6' x2='18' y2='18' />
            <line x1='18' y1='6' x2='6' y2='18' />
          </svg>
        </button>

        <header className='detail-header'>
          <div className='header-left'>
            <img
              src={getWeatherIconUrl(display.icon)}
              alt={display.desc || display.name}
              className='detail-weather-icon'
            />
            <div className='header-titles'>
              <h1 className='detail-city-name'>
                {display.name}
                {display.country ? `, ${display.country}` : ''}
              </h1>
              <p className='detail-description'>
                {display.desc
                  ? display.desc.charAt(0).toUpperCase() + display.desc.slice(1)
                  : ''}
              </p>
            </div>
          </div>

          <div className='header-right'>
            <div className='current-temp' aria-hidden>
              {formatTemperature(
                city?.temp ?? city?.main?.temp,
                temperatureUnit
              )}
            </div>
            <div className='current-meta'>
              <span>
                {city?.main?.temp
                  ? `Feels like ${formatTemperature(
                      city?.feels_like,
                      temperatureUnit
                    )}`
                  : ''}
              </span>
            </div>
          </div>
        </header>

        <section className='detailed-stats' aria-label='Current conditions'>
          <div className='stat-card'>
            <span className='stat-icon'>🌡️</span>
            <div className='stat-meta'>
              <span className='stat-label'>Feels Like</span>
              <span className='stat-value'>
                {formatTemperature(city?.feels_like, temperatureUnit)}
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>💧</span>
            <div className='stat-meta'>
              <span className='stat-label'>Humidity</span>
              <span className='stat-value'>
                {city?.humidity ?? city?.main?.humidity ?? '—'}%
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>💨</span>
            <div className='stat-meta'>
              <span className='stat-label'>Wind</span>
              <span className='stat-value'>
                {(city?.wind_speed ?? city?.wind?.speed ?? 0).toFixed(1)} m/s
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>🔽</span>
            <div className='stat-meta'>
              <span className='stat-label'>Pressure</span>
              <span className='stat-value'>
                {city?.pressure ?? city?.main?.pressure ?? '—'} hPa
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>👁️</span>
            <div className='stat-meta'>
              <span className='stat-label'>Visibility</span>
              <span className='stat-value'>
                {city?.visibility
                  ? `${(city.visibility / 1000).toFixed(1)} km`
                  : '—'}
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>☁️</span>
            <div className='stat-meta'>
              <span className='stat-label'>Clouds</span>
              <span className='stat-value'>
                {city?.clouds ?? city?.clouds?.all ?? '—'}%
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>🌅</span>
            <div className='stat-meta'>
              <span className='stat-label'>Sunrise</span>
              <span className='stat-value'>
                {city?.sunrise ? formatTime(city.sunrise) : '—'}
              </span>
            </div>
          </div>

          <div className='stat-card'>
            <span className='stat-icon'>🌇</span>
            <div className='stat-meta'>
              <span className='stat-label'>Sunset</span>
              <span className='stat-value'>
                {city?.sunset ? formatTime(city.sunset) : '—'}
              </span>
            </div>
          </div>
        </section>

        {loading && !forecast && (
          <div className='loading-forecast'>Loading forecast...</div>
        )}

        {forecast && (
          <>
            <section className='forecast-section'>
              <h2 className='section-title'>Hourly Forecast</h2>
              <div className='hourly-forecast' role='list'>
                {hourly.map((hour, i) => (
                  <div key={i} className='hour-item' role='listitem'>
                    <div className='hour-time'>{formatTime(hour.dt)}</div>
                    <img
                      src={getWeatherIconUrl(hour.icon)}
                      alt={hour.description}
                      className='hour-icon'
                    />
                    <div className='hour-temp'>
                      {formatTemperature(hour.temp, temperatureUnit)}
                    </div>
                    <div className='hour-detail'>💧 {hour.humidity}%</div>
                    <div className='hour-detail'>
                      💨 {hour.wind_speed.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className='forecast-section'>
              <h2 className='section-title'>7-Day Forecast</h2>
              <div className='daily-forecast'>
                {daily.map((day, idx) => (
                  <div key={idx} className='day-item'>
                    <div className='day-date'>{formatDate(day.dt)}</div>
                    <img
                      src={getWeatherIconUrl(day.icon)}
                      alt={day.description}
                      className='day-icon'
                    />
                    <div className='day-temp'>
                      <span className='temp-max'>
                        {formatTemperature(day.temp_max, temperatureUnit)}
                      </span>
                      <span className='temp-min'>
                        {formatTemperature(day.temp_min, temperatureUnit)}
                      </span>
                    </div>
                    <div className='day-description'>{day.description}</div>
                    <div className='day-details'>
                      <span>💧 {Math.round(day.humidity)}%</span>
                      <span>💨 {day.wind_speed.toFixed(1)} m/s</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className='forecast-section'>
              <h2 className='section-title'>Weather Trends</h2>
              <WeatherCharts
                forecast={forecast}
                temperatureUnit={temperatureUnit}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
