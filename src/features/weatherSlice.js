import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeatherData, fetchForecastData, searchCities } from '../services/weatherApi';

const CACHE_DURATION = 60000; // 60 seconds

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ cityName, lat, lon }) => {
    return await fetchWeatherData(cityName, lat, lon);
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ cityName, lat, lon }) => {
    return await fetchForecastData(cityName, lat, lon);
  }
);

export const searchCity = createAsyncThunk(
  'weather/searchCity',
  async (query) => {
    return await searchCities(query);
  }
);

const initialState = {
  currentWeather: {},
  forecasts: {},
  searchResults: [],
  loading: false,
  error: null,
  lastUpdated: {},
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch weather
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        const cityId = action.payload.id;
        state.currentWeather[cityId] = action.payload;
        state.lastUpdated[cityId] = Date.now();
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch forecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        const cityId = action.payload.cityId;
        state.forecasts[cityId] = action.payload;
        state.lastUpdated[`forecast_${cityId}`] = Date.now();
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search city
      .addCase(searchCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCity.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;

// Selectors
export const selectWeatherByCityId = (state, cityId) => state.weather.currentWeather[cityId];
export const selectForecastByCityId = (state, cityId) => state.weather.forecasts[cityId];
export const selectIsDataFresh = (state, cityId, type = 'weather') => {
  const key = type === 'forecast' ? `forecast_${cityId}` : cityId;
  const lastUpdate = state.weather.lastUpdated[key];
  if (!lastUpdate) return false;
  return Date.now() - lastUpdate < CACHE_DURATION;
};
