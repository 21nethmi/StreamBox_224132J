import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { RootState } from "@/store";
import { loginUser } from "@/store/slices/authSlice";
import { loadFavouritesFromStorage } from "@/store/slices/favouritesSlice";
import { fetchUserProfile } from "@/store/slices/profileSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

type FormData = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password too short"),
});

export default function Login() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const auth = useSelector((s: RootState) => s.auth);

  const onSubmit = async (values: FormData) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      // Load user-specific favourites after successful login
      dispatch(loadFavouritesFromStorage(result.id || result.username));
      // Fetch user profile from API
      dispatch(fetchUserProfile(result.token));
      router.replace("/(tabs)/home");
    } catch (err) {
      // error handled in slice; could show toast
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to StreamBox
              </Text>
            </View>

            <View style={styles.formCard}>
              <Controller
                control={control}
                name="username"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <FormInput
                    label="Username"
                    placeholder="Enter username"
                    icon="user"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <FormInput
                    label="Password"
                    placeholder="Enter password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />

              {auth.error ? (
                <Text style={styles.apiError}>{auth.error}</Text>
              ) : null}

              <Button
                title="Login"
                onPress={handleSubmit(onSubmit)}
                loading={auth.loading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.small}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.link}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { marginBottom: 32, alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  footer: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  small: { color: "#fff", fontSize: 15 },
  link: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  apiError: {
    color: "#ff4444",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  devReset: { marginTop: 20, alignItems: "center" },
  devText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
});
