import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import contentReducer from '../store/slices/contentSlice';
import favouritesReducer from '../store/slices/favouritesSlice';
import profileReducer from '../store/slices/profileSlice';
import themeReducer from '../store/slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    favourites: favouritesReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => store.dispatch as AppDispatch;

export default store;
