import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTemperatureUnit } from '../features/settingsSlice';
import { clearSearchResults, searchCity } from '../features/weatherSlice';
import './Header.css';

const Header = ({ onCitySelect }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const searchResults = useSelector((state) => state.weather.searchResults);
  const temperatureUnit = useSelector(
    (state) => state.settings.temperatureUnit
  );
  const [showResults, setShowResults] = useState(false);
  const error = useSelector((state) => state.weather.error);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        dispatch(searchCity(searchTerm));
        setShowResults(true);
      } else {
        dispatch(clearSearchResults());
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setSearchTerm('');
    setShowResults(false);
    dispatch(clearSearchResults());
  };

  const handleToggleUnit = () => {
    dispatch(toggleTemperatureUnit());
  };

  return (
    <header className='header'>
      <div className='header-content'>
        <h1 className='header-title'>🌤️ Weather Analytics Dashboard</h1>

        <div className='header-controls'>
          <div className='search-container'>
            <input
              type='text'
              placeholder='Search cities...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search-input'
            />

            {showResults && (
              <div className='search-results'>
                {error ? (
                  <div className='search-error'>{error}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <div
                      key={city.id}
                      className='search-result-item'
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className='city-name'>{city.name}</div>
                      <div className='city-info'>
                        {city.state && `${city.state}, `}
                        {city.country}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='search-empty'>No results</div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleToggleUnit} className='unit-toggle'>
            °{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
