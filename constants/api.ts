// TMDB API Configuration
export const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';



export const TMDB_API_KEY = '94ca179798dfd696229d3c5b4040eb8a';

export const TMDB_ENDPOINTS = {
  // Movies
  trendingMovies: '/trending/movie/week',
  popularMovies: '/movie/popular',
  topRatedMovies: '/movie/top_rated',
  movieDetails: (id: number) => `/movie/${id}`,
  searchMovie: '/search/movie',
  
  // TV Shows
  trendingTV: '/trending/tv/week',
  popularTV: '/tv/popular',
  topRatedTV: '/tv/top_rated',
  tvDetails: (id: number) => `/tv/${id}`,
  searchTV: '/search/tv',
  
  // Multi (All content)
  trendingAll: '/trending/all/week',
  searchMulti: '/search/multi',
};

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: '/w185',
    medium: '/w342',
    large: '/w500',
    original: '/original',
  },
  backdrop: {
    small: '/w300',
    medium: '/w780',
    large: '/w1280',
    original: '/original',
  },
};

export const buildTMDBUrl = (endpoint: string, params?: Record<string, any>) => {
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

export const buildImageUrl = (path: string, size: string = '/w500') => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};
