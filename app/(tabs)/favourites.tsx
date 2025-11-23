import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Favourites() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600" },
});
