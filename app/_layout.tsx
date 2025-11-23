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

export const unstable_settings = {
  // Anchor the initial mount to the auth group so auth routes render first
  anchor: "(auth)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  useEffect(() => {
    // Load favourites from AsyncStorage on app start
    dispatch(loadFavouritesFromStorage() as any);
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
