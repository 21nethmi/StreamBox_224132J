import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buildImageUrl, buildTMDBUrl, TMDB_IMAGE_SIZES } from '../../constants/api';

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

// Async thunk to fetch movies from TMDB API
export const fetchMovies = createAsyncThunk(
  'content/fetchMovies',
  async ({ contentType = 'all', searchQuery = '' }: { contentType?: string; searchQuery?: string }) => {
    try {
      let endpoint = '/trending/all/week';
      const params: Record<string, any> = {};

      // Determine endpoint based on content type and search
      if (searchQuery.trim()) {
        endpoint = contentType === 'movies' ? '/search/movie' : 
                   contentType === 'shows' ? '/search/tv' : '/search/multi';
        params.query = searchQuery;
      } else {
        endpoint = contentType === 'movies' ? '/trending/movie/week' :
                   contentType === 'shows' ? '/trending/tv/week' : '/trending/all/week';
      }

      const url = buildTMDBUrl(endpoint, params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filter out person results and map to Movie format
      const moviesData = data.results
        .filter((item: any) => item.media_type !== 'person' && item.id && (item.title || item.name) && item.poster_path)
        .map((item: any) => {
          const thumbnailUrl = buildImageUrl(item.poster_path, TMDB_IMAGE_SIZES.poster.medium);
          const backdropUrl = buildImageUrl(item.backdrop_path, TMDB_IMAGE_SIZES.backdrop.large);
          const posterUrl = buildImageUrl(item.poster_path, TMDB_IMAGE_SIZES.poster.large);
          
          return {
            id: Number(item.id),
            title: String(item.title || item.name || item.original_title || item.original_name || 'Untitled'),
            description: String(item.overview || 'No description available'),
            thumbnail: String(thumbnailUrl),
            images: [backdropUrl, posterUrl].filter(url => url && String(url).length > 0),
            rating: Number(item.vote_average) || 0,
            releaseDate: item.release_date || item.first_air_date || '',
            popularity: Number(item.popularity) || 0,
            mediaType: String(item.media_type || (contentType === 'movies' ? 'movie' : contentType === 'shows' ? 'tv' : 'movie')),
          };
        })
        .filter((item: any) => item.thumbnail && item.thumbnail.length > 0);

      return moviesData;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch movies');
    }
  }
);

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
    clearMovies(state) {
      state.movies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

// Selectors
export const selectMovies = (state: { content: ContentState }) => state.content.movies;
export const selectMovieById = (state: { content: ContentState }, id: number) => 
  state.content.movies.find(movie => movie.id === id);
export const selectMoviesLoading = (state: { content: ContentState }) => state.content.loading;
export const selectMoviesError = (state: { content: ContentState }) => state.content.error;

export const { fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure, clearMovies } = contentSlice.actions;
export default contentSlice.reducer;
