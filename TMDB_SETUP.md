# TMDB API Setup Guide

## Getting Your TMDB API Key

Follow these steps to get your free TMDB API key:

### 1. Create a TMDB Account

- Go to https://www.themoviedb.org/signup
- Sign up for a free account

### 2. Request an API Key

- After logging in, go to your account settings: https://www.themoviedb.org/settings/api
- Click on "Request an API Key"
- Select "Developer" option
- Fill out the application form:
  - **Application Name**: StreamBox (or your app name)
  - **Application URL**: You can use a placeholder like `http://localhost:3000`
  - **Application Summary**: Entertainment streaming app for browsing movies
- Accept the terms and submit

### 3. Add API Key to Your Project

Once you receive your API key:

1. Open `constants/api.ts`
2. Replace `'YOUR_TMDB_API_KEY_HERE'` with your actual API key:
   ```typescript
   export const TMDB_API_KEY = "your_actual_api_key_here";
   ```

### 4. Test the Integration

Run your app and the home screen should now display real trending movies from TMDB!

## API Features Available

The app is configured to use:

- **Trending Movies**: Weekly trending movies
- **Movie Details**: Full information about each movie
- **High-Quality Images**: Posters and backdrops from TMDB

## Important Notes

- ⚠️ **Never commit your API key to public repositories**
- Consider using environment variables for production
- Free tier allows 1,000 requests per day
- Read the full API docs: https://developer.themoviedb.org/docs/getting-started

## Current Endpoints Used

- `/trending/movie/week` - Get trending movies
- `/movie/{id}` - Get movie details (for detail screen)

## Next Steps

After adding your API key:

1. Save the file
2. Reload the app
3. Navigate to the home screen
4. You should see real movie data with posters!
