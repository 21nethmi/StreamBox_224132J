import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { loginUser } from "@/store/slices/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useDispatch } from "react-redux";
import * as yup from "yup";

type FormData = { username: string; password: string; confirm: string };

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password too short"),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password"),
});

export default function Register() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { username: "", password: "", confirm: "" },
  });

  const router = useRouter();
  const dispatch = useDispatch<any>();

  const onSubmit = async (values: FormData) => {
    // Save user locally
    try {
      const local = await AsyncStorage.getItem("local_users");
      const users = local
        ? (JSON.parse(local) as Array<{ username: string; password: string }>)
        : [];
      users.push({ username: values.username, password: values.password });
      await AsyncStorage.setItem("local_users", JSON.stringify(users));

      // Auto-login the newly registered user
      try {
        await dispatch(
          loginUser({ username: values.username, password: values.password })
        ).unwrap();
        router.replace("/(tabs)/home");
        return;
      } catch (e) {
        // If auto-login failed, at least go to login screen
        console.log("[Register] auto-login failed", e);
        router.replace("/(auth)/login");
      }
    } catch (e) {
      console.log("[Register] error saving local user", e);
      router.replace("/(auth)/login");
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
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join StreamBox today</Text>
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
                    placeholder="Choose a username"
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
                    placeholder="Create password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirm"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <FormInput
                    label="Confirm password"
                    placeholder="Repeat password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />

              <Button title="Register" onPress={handleSubmit(onSubmit)} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.small}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.link}>Login</Text>
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
    color: "rgba(255,255,255,0.9)",
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
  devReset: { marginTop: 20, alignItems: "center" },
  devText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
});
