import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import { RootState } from "../../store";
import { Movie } from "../../store/slices/contentSlice";

export default function Favourites() {
  const { favourites } = useSelector((state: RootState) => state.favourites);

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Favourites</Text>
        <Text style={styles.subtitle}>
          {favourites.length} {favourites.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {favourites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>No favourites yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding movies and shows to your favourites!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item: Movie) => `fav-${item.id}`}
          renderItem={({ item }) => (
            <MovieCard
              id={item.id}
              title={item.title}
              description={item.description}
              thumbnail={item.thumbnail}
              rating={item.rating}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
});
