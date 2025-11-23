import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  label?: string;
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  error?: string | null;
}

export default function FormInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  error,
}: Props) {
  const [visible, setVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        {icon ? (
          <Feather name={icon as any} size={18} style={styles.icon} />
        ) : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setVisible((v) => !v)}>
            <Feather
              name={visible ? "eye" : "eye-off"}
              size={18}
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { marginBottom: 8, fontSize: 15, color: "#333", fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  input: { flex: 1, fontSize: 16, padding: 0, color: "#333" },
  icon: { marginRight: 10, color: "#888" },
  errorText: {
    color: "#ff4444",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  inputError: { borderColor: "#ff4444", backgroundColor: "#fff5f5" },
});
