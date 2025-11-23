import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { Provider, useDispatch } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import store from "@/store";
import { loadFavouritesFromStorage } from "@/store/slices/favouritesSlice";
import {
  fetchUserProfile,
  loadProfileFromStorage,
} from "@/store/slices/profileSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const unstable_settings = {
  // Anchor the initial mount to the auth group so auth routes render first
  anchor: "(auth)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  useEffect(() => {
    // Load profile and favourites from AsyncStorage on app start
    dispatch(loadProfileFromStorage() as any);

    // Load user-specific data if user is logged in
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // Load user-specific favourites
          dispatch(loadFavouritesFromStorage(user.id || user.username) as any);
          // Fetch fresh profile from API
          dispatch(fetchUserProfile(token) as any);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };

    loadUserData();
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
