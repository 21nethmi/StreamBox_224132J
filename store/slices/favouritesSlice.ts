import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './contentSlice';

const FAVOURITES_STORAGE_PREFIX = '@streambox_favourites_';

// Get storage key for specific user
const getFavouritesStorageKey = (userId: string | number) => {
  return `${FAVOURITES_STORAGE_PREFIX}${userId}`;
};

interface FavouritesState {
  favourites: Movie[];
  loading: boolean;
  userId: string | number | null;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
  userId: null,
};

// Async thunk to load favourites from AsyncStorage for specific user
export const loadFavouritesFromStorage = createAsyncThunk(
  'favourites/loadFromStorage',
  async (userId: string | number) => {
    try {
      const storageKey = getFavouritesStorageKey(userId);
      const storedFavourites = await AsyncStorage.getItem(storageKey);
      if (storedFavourites) {
        return { favourites: JSON.parse(storedFavourites) as Movie[], userId };
      }
      return { favourites: [], userId };
    } catch (error) {
      console.error('Error loading favourites from storage:', error);
      return { favourites: [], userId };
    }
  }
);

// Helper function to save favourites to AsyncStorage for specific user
const saveFavouritesToStorage = async (favourites: Movie[], userId: string | number | null) => {
  try {
    if (!userId) {
      console.warn('No userId provided, favourites not saved');
      return;
    }
    const storageKey = getFavouritesStorageKey(userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(favourites));
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
        saveFavouritesToStorage(state.favourites, state.userId);
      }
    },
    removeFavourite(state, action: PayloadAction<number>) {
      state.favourites = state.favourites.filter(fav => fav.id !== action.payload);
      saveFavouritesToStorage(state.favourites, state.userId);
    },
    toggleFavourite(state, action: PayloadAction<Movie>) {
      const exists = state.favourites.find(fav => fav.id === action.payload.id);
      if (exists) {
        state.favourites = state.favourites.filter(fav => fav.id !== action.payload.id);
      } else {
        state.favourites.push(action.payload);
      }
      saveFavouritesToStorage(state.favourites, state.userId);
    },
    clearFavourites(state) {
      state.favourites = [];
      state.userId = null;
      // Note: We don't save empty array to storage on logout, each user keeps their favourites
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavouritesFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavouritesFromStorage.fulfilled, (state, action) => {
        state.favourites = action.payload.favourites;
        state.userId = action.payload.userId;
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
