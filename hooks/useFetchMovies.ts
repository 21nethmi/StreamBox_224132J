import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buildImageUrl, buildTMDBUrl, TMDB_IMAGE_SIZES } from '../constants/api';
import { AppDispatch, RootState } from '../redux/store';
import { fetchMoviesFailure, fetchMoviesStart, fetchMoviesSuccess } from '../store/slices/contentSlice';

type ContentType = 'all' | 'movies' | 'shows' | 'podcasts' | 'songs';

const getEndpoint = (contentType: ContentType, isSearch: boolean, searchQuery: string) => {
  if (isSearch && searchQuery.trim()) {
    switch (contentType) {
      case 'movies':
        return { endpoint: '/search/movie', query: searchQuery };
      case 'shows':
        return { endpoint: '/search/tv', query: searchQuery };
      case 'all':
        return { endpoint: '/search/multi', query: searchQuery };
      default:
        return null; // Podcasts and songs not available
    }
  } else {
    // Trending/popular content
    switch (contentType) {
      case 'all':
        return { endpoint: '/trending/all/week' };
      case 'movies':
        return { endpoint: '/trending/movie/week' };
      case 'shows':
        return { endpoint: '/trending/tv/week' };
      default:
        return null; // Podcasts and songs not available
    }
  }
};

export const useFetchMovies = (searchQuery: string = '', contentType: ContentType = 'all') => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.content);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      // Skip fetching for podcasts and songs entirely
      if (contentType === 'podcasts' || contentType === 'songs') {
        dispatch(fetchMoviesSuccess([]));
        return;
      }

      dispatch(fetchMoviesStart());

      try {
        const isSearch = debouncedQuery.trim().length > 0;
        const endpointConfig = getEndpoint(contentType, isSearch, debouncedQuery);
        
        // If endpoint is null, show empty state
        if (!endpointConfig) {
          dispatch(fetchMoviesSuccess([]));
          return;
        }

        const params = endpointConfig.query ? { query: endpointConfig.query } : {};
        const url = buildTMDBUrl(endpointConfig.endpoint, params);
        
        console.log('Fetching from TMDB:', endpointConfig.endpoint, 'Type:', contentType);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Content fetched successfully, count:', data.results?.length);

        // Filter out person results when fetching "all" content
        const filteredResults = data.results.filter((item: any) => 
          item.media_type !== 'person'
        );

        // Map TMDB data to our movie format
        const moviesData = filteredResults
          .filter((item: any) => {
            // Filter out items without id, title, or poster
            return item.id && (item.title || item.name) && item.poster_path;
          })
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
          .filter((item: any) => item.thumbnail && item.thumbnail.length > 0); // Final check for valid thumbnail

        dispatch(fetchMoviesSuccess(moviesData));
      } catch (err: any) {
        console.error('Error fetching content:', err);
        dispatch(fetchMoviesFailure(err.message || 'Failed to fetch content'));
      }
    };

    fetchMovies();
  }, [dispatch, debouncedQuery, contentType]);

  return { movies, loading, error };
};
