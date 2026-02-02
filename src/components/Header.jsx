import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTemperatureUnit } from '../features/settingsSlice';
import { clearSearchResults, searchCity } from '../features/weatherSlice';
import './Header.css';

const Header = ({ onCitySelect }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);

  const searchResults = useSelector((state) => state.weather.searchResults);
  const temperatureUnit = useSelector(
    (state) => state.settings.temperatureUnit
  );
  const [showResults, setShowResults] = useState(false);
  const error = useSelector((state) => state.weather.error);

  // bounce animation state when user attempts invalid search (e.g., Enter with <2 chars)
  const [bounce, setBounce] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        // visible debug so user can see searches in console
        // eslint-disable-next-line no-console
        console.log('Dispatching searchCity for:', searchTerm);
        dispatch(searchCity(searchTerm));
        setShowResults(true);
      } else {
        dispatch(clearSearchResults());
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Handle pressing Enter to run immediate search or trigger bounce if term too short
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchTerm.length >= 2) {
        dispatch(searchCity(searchTerm));
        setShowResults(true);
      } else {
        // trigger bounce animation
        setBounce(true);
      }
    }
  };

  // clear bounce after animation end (safety fallback)
  const onBounceEnd = () => setBounce(false);

  // Track system color scheme and update when it changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(!!e.matches);
    setIsDark(!!mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handleChange);
    else mq.addListener(handleChange);
    return () => {
      if (mq.removeEventListener)
        mq.removeEventListener('change', handleChange);
      else mq.removeListener(handleChange);
    };
  }, []);

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
    <header className={`header ${isDark ? 'header--dark' : 'header--light'}`}>
      <div className='header-content'>
        <h1 className='header-title'>🌤️ Weather Analytics Dashboard</h1>

        <div className='header-controls'>
          <div className='search-container'>
            <input
              type='text'
              aria-label='Search cities'
              placeholder='Search cities...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${bounce ? 'search-bounce' : ''}`}
              onKeyDown={handleKeyDown}
              onAnimationEnd={onBounceEnd}
            />

            {showResults && (
              <div className='search-results' role='listbox'>
                {error ? (
                  <div className='search-error'>{error}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <div
                      key={city.id}
                      role='option'
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

          <button
            onClick={handleToggleUnit}
            className='unit-toggle'
            aria-pressed={temperatureUnit !== 'celsius'}
          >
            °{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
