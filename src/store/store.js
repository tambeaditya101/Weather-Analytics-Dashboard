import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weatherSlice';
import settingsReducer from '../features/settingsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    settings: settingsReducer,
  },
});
