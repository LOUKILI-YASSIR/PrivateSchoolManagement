import { createSlice } from '@reduxjs/toolkit';

// Get initial dark mode preference from localStorage or system preference
const getInitialDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    return savedMode === 'true';
  }
  // Check for system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialDarkMode(),
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
  },
});

export const { setDarkMode, toggleDarkMode } = ThemeSlice.actions;

export default ThemeSlice.reducer; 