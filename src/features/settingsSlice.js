import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const initialState = {
  favorites: loadFromLocalStorage('favorites', []),
  temperatureUnit: loadFromLocalStorage('temperatureUnit', 'celsius'),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.find(fav => fav.id === action.payload.id)) {
        state.favorites.push(action.payload);
        saveToLocalStorage('favorites', state.favorites);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      saveToLocalStorage('favorites', state.favorites);
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      saveToLocalStorage('temperatureUnit', state.temperatureUnit);
    },
  },
});

export const { addFavorite, removeFavorite, toggleTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
