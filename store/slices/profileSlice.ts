import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearProfile, getProfile, Profile, saveProfile } from '../../services/storage';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

/**
 * Load profile from AsyncStorage
 */
export const loadProfileFromStorage = createAsyncThunk(
  'profile/loadFromStorage',
  async () => {
    try {
      const profile = await getProfile();
      return profile;
    } catch (error) {
      console.error('Error loading profile from storage:', error);
      return null;
    }
  }
);

/**
 * Fetch user profile from API using auth token
 */
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchFromAPI',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      
      const profile: Profile = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        avatar: data.image,
      };

      // Save to AsyncStorage
      await saveProfile(profile);
      
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

/**
 * Update profile and save to AsyncStorage
 */
export const updateProfileAsync = createAsyncThunk(
  'profile/updateProfile',
  async (profile: Profile, { rejectWithValue }) => {
    try {
      await saveProfile(profile);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

/**
 * Clear profile from AsyncStorage (on logout)
 */
export const clearProfileAsync = createAsyncThunk(
  'profile/clearProfile',
  async () => {
    try {
      await clearProfile();
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      state.error = null;
    },
    resetProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load profile
      .addCase(loadProfileFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfileFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(loadProfileFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load profile';
      })
      // Fetch profile from API
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch profile';
      })
      // Update profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update profile';
      })
      // Clear profile
      .addCase(clearProfileAsync.fulfilled, (state) => {
        state.profile = null;
        state.loading = false;
        state.error = null;
      });
  },
});

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
