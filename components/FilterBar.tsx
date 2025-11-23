import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export type ContentType = "all" | "movies" | "shows" | "podcasts";

interface FilterOption {
  id: ContentType;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const filterOptions: FilterOption[] = [
  { id: "all", label: "All", icon: "grid" },
  { id: "movies", label: "Movies", icon: "film" },
  { id: "shows", label: "TV Shows", icon: "tv" },
  { id: "podcasts", label: "Podcasts", icon: "mic" },
];

interface FilterBarProps {
  selectedFilter: ContentType;
  onFilterChange: (filter: ContentType) => void;
}

export default function FilterBar({
  selectedFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.filterButton,
            selectedFilter === option.id && styles.filterButtonActive,
          ]}
          onPress={() => onFilterChange(option.id)}
          activeOpacity={0.7}
        >
          <Feather
            name={option.icon}
            size={18}
            color={
              selectedFilter === option.id ? "#fff" : "rgba(255, 255, 255, 0.7)"
            }
          />
          <Text
            style={[
              styles.filterText,
              selectedFilter === option.id && styles.filterTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  filterTextActive: {
    color: "#fff",
  },
});
