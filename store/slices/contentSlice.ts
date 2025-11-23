import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  rating?: number;
  releaseDate?: string;
  popularity?: number;
  mediaType?: string;
}

interface ContentState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  movies: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    fetchMoviesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess(state, action: PayloadAction<Movie[]>) {
      state.loading = false;
      state.movies = action.payload;
      state.error = null;
    },
    fetchMoviesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure } = contentSlice.actions;
export default contentSlice.reducer;
