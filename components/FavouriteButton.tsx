import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Movie } from "../store/slices/contentSlice";
import { addFavourite, removeFavourite } from "../store/slices/favouritesSlice";

interface FavouriteButtonProps {
  movie: Movie;
  size?: number;
  showLabel?: boolean;
  variant?: "icon" | "button";
}

export default function FavouriteButton({
  movie,
  size = 24,
  showLabel = false,
  variant = "icon",
}: FavouriteButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { favourites } = useSelector((state: RootState) => state.favourites);

  const isFavourite = favourites.some((fav) => fav.id === movie.id);

  const handleToggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFavourite(movie.id));
    } else {
      dispatch(addFavourite(movie));
    }
  };

  if (variant === "button") {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          isFavourite ? styles.buttonFavourited : styles.buttonNotFavourited,
        ]}
        onPress={handleToggleFavourite}
        activeOpacity={0.7}
      >
        <Feather
          name={isFavourite ? "heart" : "heart"}
          size={size}
          color={isFavourite ? "#fff" : "#667eea"}
        />
        {showLabel && (
          <Text
            style={[
              styles.buttonLabel,
              isFavourite ? styles.labelFavourited : styles.labelNotFavourited,
            ]}
          >
            {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={handleToggleFavourite}
      activeOpacity={0.7}
    >
      <Feather
        name={isFavourite ? "heart" : "heart"}
        size={size}
        color={isFavourite ? "#ff4757" : "#1a1a1a"}
        fill={isFavourite ? "#ff4757" : "transparent"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
  },
  buttonFavourited: {
    backgroundColor: "#ff4757",
    borderColor: "#ff4757",
  },
  buttonNotFavourited: {
    backgroundColor: "transparent",
    borderColor: "#667eea",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelFavourited: {
    color: "#fff",
  },
  labelNotFavourited: {
    color: "#667eea",
  },
});
