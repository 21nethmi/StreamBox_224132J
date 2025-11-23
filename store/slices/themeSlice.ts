import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Theme types
export type Theme = 'light' | 'dark';

// State interface
interface ThemeState {
  theme: Theme;
  loading: boolean;
}

// Initial state
const initialState: ThemeState = {
  theme: 'light',
  loading: false,
};

// Async thunk to load theme from AsyncStorage
export const loadThemeFromStorage = createAsyncThunk(
  'theme/loadFromStorage',
  async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@streambox_theme');
      return storedTheme as Theme | null;
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
      return null;
    }
  }
);

// Async thunk to save theme to AsyncStorage
export const saveThemeToStorage = createAsyncThunk(
  'theme/saveToStorage',
  async (theme: Theme) => {
    try {
      await AsyncStorage.setItem('@streambox_theme', theme);
      return theme;
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
      throw error;
    }
  }
);

// Create slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Toggle between light and dark theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    // Set specific theme
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load theme from storage
    builder.addCase(loadThemeFromStorage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadThemeFromStorage.fulfilled, (state, action) => {
      if (action.payload) {
        state.theme = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(loadThemeFromStorage.rejected, (state) => {
      state.loading = false;
    });

    // Save theme to storage
    builder.addCase(saveThemeToStorage.fulfilled, (state, action) => {
      state.theme = action.payload;
    });
  },
});

// Export actions
export const { toggleTheme, setTheme } = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;
