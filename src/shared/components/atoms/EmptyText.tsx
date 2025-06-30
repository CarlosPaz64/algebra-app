import React from "react";
import { Text, StyleSheet } from "react-native";

export const EmptyText = () => (
  <Text style={styles.empty}>No hay nada de momento... Hasta ahora...</Text>
);

const styles = StyleSheet.create({
  empty: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
