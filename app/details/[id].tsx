import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FavouriteButton from "../../components/FavouriteButton";
import {
  buildImageUrl,
  buildTMDBUrl,
  TMDB_IMAGE_SIZES,
} from "../../constants/api";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Movie } from "../../store/slices/contentSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface MovieDetails extends Movie {
  genres?: { id: number; name: string }[];
  runtime?: number;
  status?: string;
  tagline?: string;
  voteCount?: number;
  budget?: number;
  revenue?: number;
  originalLanguage?: string;
}

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  const colors = useThemeColors();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try fetching as a movie first
        let url = buildTMDBUrl(`/movie/${id}`);
        let response = await fetch(url);

        // If movie not found, try TV show
        if (!response.ok) {
          url = buildTMDBUrl(`/tv/${id}`);
          response = await fetch(url);
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch details: ${response.status}`);
        }

        const data = await response.json();

        const movieDetails: MovieDetails = {
          id: data.id,
          title: data.title || data.name || "Untitled",
          description: data.overview || "No description available",
          thumbnail: buildImageUrl(
            data.poster_path,
            TMDB_IMAGE_SIZES.poster.large
          ),
          images: [
            buildImageUrl(
              data.backdrop_path,
              TMDB_IMAGE_SIZES.backdrop.original
            ),
            buildImageUrl(data.poster_path, TMDB_IMAGE_SIZES.poster.original),
          ].filter((url) => url),
          rating: data.vote_average || 0,
          releaseDate: data.release_date || data.first_air_date,
          popularity: data.popularity,
          mediaType: data.title ? "movie" : "tv",
          genres: data.genres || [],
          runtime: data.runtime || data.episode_run_time?.[0],
          status: data.status,
          tagline: data.tagline,
          voteCount: data.vote_count,
          budget: data.budget,
          revenue: data.revenue,
          originalLanguage: data.original_language,
        };

        setMovie(movieDetails);
      } catch (err: any) {
        console.error("Error fetching movie details:", err);
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading details...
        </Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Feather name="alert-circle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || "Movie not found"}
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backdropImage = movie.images?.[0] || movie.thumbnail;
  const statusText =
    movie.popularity && movie.popularity > 100 ? "Popular" : "Trending";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image with Gradient Overlay */}
        <View style={styles.headerContainer}>
          {backdropImage ? (
            <Image
              source={{ uri: backdropImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.coverImage,
                styles.placeholderCover,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Feather name="film" size={80} color={colors.textTertiary} />
            </View>
          )}

          <LinearGradient
            colors={
              colors.background === "#121212"
                ? ["transparent", "rgba(18,18,18,0.7)", "rgba(18,18,18,0.95)"]
                : [
                    "transparent",
                    "rgba(255,255,255,0.7)",
                    "rgba(255,255,255,0.95)",
                  ]
            }
            style={styles.gradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.headerBackButton,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Favourite Button */}
          <View style={styles.headerFavouriteButton}>
            <FavouriteButton movie={movie} size={24} variant="icon" />
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {movie.title}
          </Text>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Feather name="trending-up" size={16} color="#4ade80" />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {statusText}
            </Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadataContainer}>
            {movie.rating && movie.rating > 0 && (
              <View style={styles.metadataItem}>
                <Feather name="star" size={16} color="#FFD700" />
                <Text
                  style={[styles.metadataText, { color: colors.textSecondary }]}
                >
                  {movie.rating.toFixed(1)}/10
                </Text>
              </View>
            )}
            {movie.releaseDate && (
              <View style={styles.metadataItem}>
                <Feather name="calendar" size={16} color="#667eea" />
                <Text
                  style={[styles.metadataText, { color: colors.textSecondary }]}
                >
                  {new Date(movie.releaseDate).getFullYear()}
                </Text>
              </View>
            )}
            {movie.runtime && (
              <View style={styles.metadataItem}>
                <Feather name="clock" size={16} color="#667eea" />
                <Text
                  style={[styles.metadataText, { color: colors.textSecondary }]}
                >
                  {movie.runtime} min
                </Text>
              </View>
            )}
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View
                  key={genre.id}
                  style={[
                    styles.genreChip,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.genreText, { color: colors.text }]}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tagline */}
          {movie.tagline && (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              "{movie.tagline}"
            </Text>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Overview
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {movie.description}
            </Text>
          </View>

          {/* Additional Info */}
          {movie.status && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Status
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {movie.status}
              </Text>
            </View>
          )}

          {movie.voteCount && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                User Reviews
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {movie.voteCount.toLocaleString()} votes
              </Text>
            </View>
          )}

          {/* Add to Favourites Button */}
          <View style={styles.actionContainer}>
            <FavouriteButton
              movie={movie}
              size={20}
              showLabel
              variant="button"
            />
          </View>

          {/* Play Button */}
          <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.playButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="play" size={24} color="#fff" />
              <Text style={styles.playButtonText}>Watch Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    position: "relative",
    height: SCREEN_HEIGHT * 0.5,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  placeholderCover: {
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  headerBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerFavouriteButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  content: {
    padding: 20,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  genreChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 13,
    fontWeight: "500",
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 15,
  },
  actionContainer: {
    marginBottom: 16,
  },
  playButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 40,
  },
  playButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
