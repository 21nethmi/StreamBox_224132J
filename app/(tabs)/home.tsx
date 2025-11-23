import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import MovieCard from "../../components/MovieCard";
import SearchBar from "../../components/SearchBar";
import { useFetchMovies } from "../../hooks/useFetchMovies";
import { Movie } from "../../store/slices/contentSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type TabType = "discover" | "movies" | "shows" | "podcasts" | "songs";

const tabs = [
  {
    id: "discover" as TabType,
    label: "Discover & Stream",
    filter: "all" as const,
  },
  { id: "movies" as TabType, label: "Movies", filter: "movies" as const },
  { id: "shows" as TabType, label: "TV Shows", filter: "shows" as const },
  { id: "podcasts" as TabType, label: "Podcasts", filter: "podcasts" as const },
  { id: "songs" as TabType, label: "Songs", filter: "songs" as const },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [displayedTab, setDisplayedTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleTabPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setDisplayedTab(index);
  };

  const handlePageSelected = (e: any) => {
    const newPosition = e.nativeEvent.position;
    setActiveTab(newPosition);
    setDisplayedTab(newPosition);
  };

  const handlePageScroll = (e: any) => {
    const { position } = e.nativeEvent;
    setActiveTab(position);
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>StreamBox</Text>
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === index && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search movies, shows, podcasts..."
        />
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
        ref={pagerRef}
      >
        {tabs.map((tab, index) => (
          <View key={tab.id} style={styles.page}>
            <TabContent
              contentType={tab.filter}
              searchQuery={searchQuery}
              isActive={displayedTab === index}
            />
          </View>
        ))}
      </PagerView>
    </LinearGradient>
  );
}

interface TabContentProps {
  contentType: "all" | "movies" | "shows" | "podcasts" | "songs";
  searchQuery: string;
  isActive: boolean;
}

function TabContent({ contentType, searchQuery, isActive }: TabContentProps) {
  // For podcasts and songs, show coming soon message immediately without fetching
  if (isActive && (contentType === "podcasts" || contentType === "songs")) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {contentType === "podcasts" ? "Podcasts" : "Songs"} coming soon!
        </Text>
      </View>
    );
  }

  const { movies, loading, error } = useFetchMovies(
    isActive ? searchQuery : "",
    isActive ? contentType : "all"
  );

  if (!isActive) {
    return null;
  }

  if (loading && movies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {String(error)}</Text>
      </View>
    );
  }

  if (movies.length === 0 && !loading) {
    const emptyMessage =
      contentType === "podcasts"
        ? "Podcasts coming soon!"
        : contentType === "songs"
        ? "Songs coming soon!"
        : searchQuery
        ? "No results found"
        : "No content available";

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item: Movie, index: number) => {
        return item?.id
          ? `${contentType}-${item.id}`
          : `${contentType}-${index}`;
      }}
      renderItem={({ item }) => {
        // Safety check: ensure item has required data including thumbnail
        if (!item || !item.id || !item.thumbnail) return null;

        return (
          <MovieCard
            id={item.id}
            title={item.title || "Untitled"}
            description={item.description || "No description available"}
            thumbnail={item.thumbnail}
            rating={item.rating}
          />
        );
      }}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#fff",
    fontSize: 13,
  },
  activeIndicator: {
    width: "80%",
    height: 3,
    backgroundColor: "#4ade80",
    borderRadius: 2,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
});
