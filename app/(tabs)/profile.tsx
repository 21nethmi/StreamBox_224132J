import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { logout } from "../../store/slices/authSlice";
import { clearFavourites } from "../../store/slices/favouritesSlice";
import {
  clearProfileAsync,
  fetchUserProfile,
  loadProfileFromStorage,
  selectProfile,
} from "../../store/slices/profileSlice";
import { saveThemeToStorage, toggleTheme } from "../../store/slices/themeSlice";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => selectProfile(state));
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    // Load profile data on mount
    dispatch(loadProfileFromStorage());

    // Fetch fresh profile data from API if token exists
    const fetchProfile = async () => {
      const token = user ? await AsyncStorage.getItem("token") : null;
      if (token) {
        dispatch(fetchUserProfile(token));
      }
    };

    fetchProfile();
  }, [dispatch, user]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(clearProfileAsync());
    dispatch(clearFavourites()); // Clear favourites from state (not storage)
    dispatch(logout());
    router.replace("/(auth)/login" as any);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit" as any);
  };

  const handleFavourites = () => {
    router.push("/(tabs)/favourites");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    const newTheme = isDarkMode ? "light" : "dark";
    dispatch(saveThemeToStorage(newTheme));
  };

  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || "U";
  };

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || "User";
  const displayEmail = profile?.email || user?.email || "user@example.com";
  const displayUsername = profile?.username || user?.username || "username";
  const displayAvatar = profile?.avatar || user?.image;

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#1a1a2e", "#16213e", "#0f3460"]
          : ["#667eea", "#764ba2", "#f093fb"]
      }
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>@{displayUsername}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={handleEditProfile}>
            <View style={styles.optionLeft}>
              <Feather name="edit" size={22} color="#fff" />
              <Text style={styles.optionText}>Edit Profile</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="rgba(255, 255, 255, 0.6)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              Alert.alert("Change Password", "This feature is coming soon!")
            }
          >
            <View style={styles.optionLeft}>
              <Feather name="lock" size={22} color="#fff" />
              <Text style={styles.optionText}>Change Password</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="rgba(255, 255, 255, 0.6)"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleFavourites}>
            <View style={styles.optionLeft}>
              <Feather name="heart" size={22} color="#fff" />
              <Text style={styles.optionText}>Favourites</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="rgba(255, 255, 255, 0.6)"
            />
          </TouchableOpacity>

          {/* Dark Mode Toggle */}
          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Feather name="moon" size={22} color="#fff" />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{
                false: "rgba(255, 255, 255, 0.3)",
                true: "#667eea",
              }}
              thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="rgba(255, 255, 255, 0.3)"
            />
          </View>

          <TouchableOpacity
            style={[styles.option, styles.logoutOption]}
            onPress={handleLogout}
          >
            <View style={styles.optionLeft}>
              <Feather name="log-out" size={22} color="#fff" />
              <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather
              name="log-out"
              size={48}
              color="#667eea"
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  logoutOption: {
    backgroundColor: "rgba(255, 68, 68, 0.2)",
    borderColor: "rgba(255, 68, 68, 0.4)",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
