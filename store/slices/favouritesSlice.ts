import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './contentSlice';

const FAVOURITES_STORAGE_KEY = '@streambox_favourites';

interface FavouritesState {
  favourites: Movie[];
  loading: boolean;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
};

// Async thunk to load favourites from AsyncStorage
export const loadFavouritesFromStorage = createAsyncThunk(
  'favourites/loadFromStorage',
  async () => {
    try {
      const storedFavourites = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
      if (storedFavourites) {
        return JSON.parse(storedFavourites) as Movie[];
      }
      return [];
    } catch (error) {
      console.error('Error loading favourites from storage:', error);
      return [];
    }
  }
);

// Helper function to save favourites to AsyncStorage
const saveFavouritesToStorage = async (favourites: Movie[]) => {
  try {
    await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
  } catch (error) {
    console.error('Error saving favourites to storage:', error);
  }
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite(state, action: PayloadAction<Movie>) {
      const exists = state.favourites.find(fav => fav.id === action.payload.id);
      if (!exists) {
        state.favourites.push(action.payload);
        saveFavouritesToStorage(state.favourites);
      }
    },
    removeFavourite(state, action: PayloadAction<number>) {
      state.favourites = state.favourites.filter(fav => fav.id !== action.payload);
      saveFavouritesToStorage(state.favourites);
    },
    toggleFavourite(state, action: PayloadAction<Movie>) {
      const exists = state.favourites.find(fav => fav.id === action.payload.id);
      if (exists) {
        state.favourites = state.favourites.filter(fav => fav.id !== action.payload.id);
      } else {
        state.favourites.push(action.payload);
      }
      saveFavouritesToStorage(state.favourites);
    },
    clearFavourites(state) {
      state.favourites = [];
      saveFavouritesToStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavouritesFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavouritesFromStorage.fulfilled, (state, action) => {
        state.favourites = action.payload;
        state.loading = false;
      })
      .addCase(loadFavouritesFromStorage.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Selectors
export const selectFavourites = (state: { favourites: FavouritesState }) => state.favourites.favourites;
export const selectIsFavourite = (state: { favourites: FavouritesState }, id: number) => 
  state.favourites.favourites.some(fav => fav.id === id);
export const selectFavouritesLoading = (state: { favourites: FavouritesState }) => state.favourites.loading;

export const { addFavourite, removeFavourite, toggleFavourite, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
