import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
} | null;

interface AuthState {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // First check for locally registered users saved in AsyncStorage
      const local = await AsyncStorage.getItem('local_users');
      if (local) {
        try {
          const users: Array<{ username: string; password: string }> = JSON.parse(local);
          const found = users.find((u) => u.username === credentials.username && u.password === credentials.password);
          if (found) {
            // create a local token and persist
            const token = `local-${Date.now()}`;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('username', credentials.username);
            return { username: credentials.username, token };
          }
        } catch (e) {
          // ignore parse errors and fallback to remote
        }
      }

      // Fallback to remote DummyJSON login
      console.log('[Auth] Attempting DummyJSON login with:', credentials.username);
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('[Auth] Response status:', res.status, res.statusText);
      const text = await res.text();
      console.log('[Auth] Response body:', text);

      if (!res.ok) {
        return rejectWithValue(text || 'Login failed');
      }

      const data = JSON.parse(text);

      // store token and user data locally
      await AsyncStorage.setItem('token', data.accessToken || data.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      }));
      console.log('[Auth] Login successful, token and user data saved');

      return {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
        token: data.accessToken || data.token,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ id: number; username: string; email: string; firstName: string; lastName: string; gender: string; image: string; token: string }>) {
      state.loading = false;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        gender: action.payload.gender,
        image: action.payload.image,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          gender: action.payload.gender,
          image: action.payload.image,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Note: Favourites will be loaded by the app after login via userId
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
