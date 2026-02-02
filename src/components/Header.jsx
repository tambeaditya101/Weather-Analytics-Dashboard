import { useEffect, useRef, useState } from 'react';
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

  // keyboard navigation & focus
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        // eslint-disable-next-line no-console
        console.log('Dispatching searchCity for:', searchTerm);
        dispatch(searchCity(searchTerm));
        setShowResults(true);
      } else {
        dispatch(clearSearchResults());
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // capture printable key presses anywhere to focus input and insert char
  useEffect(() => {
    const handleGlobalKey = (e) => {
      // ignore when modifiers used or input already focused
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const active = document.activeElement;
      if (active === inputRef.current) return;
      if (e.key && e.key.length === 1 && /\S/.test(e.key)) {
        e.preventDefault();
        setSearchTerm((prev) => prev + e.key);
        inputRef.current?.focus();
        setShowResults(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // reset highlight when results change
  useEffect(() => {
    if (showResults && searchResults && searchResults.length > 0) {
      setHighlightIndex(0);
    } else {
      setHighlightIndex(-1);
    }
  }, [searchResults, showResults]);

  // Handle pressing Enter to run immediate search or trigger bounce if term too short
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (highlightIndex >= 0 && searchResults?.[highlightIndex]) {
        e.preventDefault();
        handleCitySelect(searchResults[highlightIndex]);
        return;
      }
      if (searchTerm.length >= 2) {
        dispatch(searchCity(searchTerm));
        setShowResults(true);
      } else {
        setBounce(true);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showResults) setShowResults(true);
      setHighlightIndex((i) => {
        const next = Math.min(
          i === -1 ? 0 : i + 1,
          (searchResults?.length ?? 1) - 1
        );
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setHighlightIndex(-1);
    }
  };

  // keep highlighted item visible
  useEffect(() => {
    if (highlightIndex < 0) return;
    const el = resultsRef.current?.querySelector(
      `#search-result-${highlightIndex}`
    );
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [highlightIndex]);

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
              ref={inputRef}
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
              <div className='search-results' role='listbox' ref={resultsRef}>
                {error ? (
                  <div className='search-error'>{error}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city, idx) => (
                    <div
                      id={`search-result-${idx}`}
                      key={city.id ?? `${city.name}-${idx}`}
                      role='option'
                      aria-selected={highlightIndex === idx}
                      className={`search-result-item ${
                        highlightIndex === idx ? 'highlighted' : ''
                      }`}
                      onMouseEnter={() => setHighlightIndex(idx)}
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
