import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("[Startup] Platform:", Platform.OS, " token:", token);
        if (!mounted) return;
        if (token) {
          router.replace("/(tabs)/home");
        } else {
          // Show register first for new users, then login
          router.replace("/(auth)/register");
        }
      } catch (e) {
        console.log("[Startup] AsyncStorage error", e);
        // fallback to register on error
        router.replace("/(auth)/register");
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return <View />;
}
