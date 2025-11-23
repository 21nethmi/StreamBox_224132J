import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useThemeColors } from "../hooks/useThemeColors";
import { AppDispatch, RootState } from "../redux/store";
import { addFavourite, removeFavourite } from "../store/slices/favouritesSlice";

interface MovieCardProps {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  rating?: number;
}

export default function MovieCard({
  id,
  title,
  description,
  thumbnail,
  rating,
}: MovieCardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { favourites } = useSelector((state: RootState) => state.favourites);
  const colors = useThemeColors();

  const isFavourite = favourites.some((fav) => fav.id === id);

  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleFavouritePress = (e: any) => {
    e.stopPropagation(); // Prevent card navigation when tapping heart

    const movie = {
      id,
      title,
      description,
      thumbnail,
      rating,
    };

    if (isFavourite) {
      dispatch(removeFavourite(id));
    } else {
      dispatch(addFavourite(movie));
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/details/${id}`)}
      activeOpacity={0.8}
    >
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Feather name="film" size={40} color="#ccc" />
        </View>
      )}

      {/* Favourite Button */}
      <TouchableOpacity
        style={styles.favouriteButton}
        onPress={handleFavouritePress}
        activeOpacity={0.7}
      >
        <Feather
          name="heart"
          size={20}
          color={isFavourite ? "#ff4757" : "#fff"}
          fill={isFavourite ? "#ff4757" : "transparent"}
        />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {title || "Untitled"}
          </Text>
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {truncateText(description || "No description available")}
          </Text>
          <View style={styles.footer}>
            {rating && rating > 0 && (
              <View style={styles.rating}>
                <Feather name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {String(rating.toFixed(1))}/10
                </Text>
              </View>
            )}
            <View style={styles.playButton}>
              <Feather name="play-circle" size={20} color="#667eea" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#e8e8e8",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  favouriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  overlay: {
    padding: 16,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
});
