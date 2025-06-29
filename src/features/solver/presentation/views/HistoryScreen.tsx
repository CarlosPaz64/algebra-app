import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEquationStore } from "../UseEquationStore";
import { MathRenderer } from "../../../../../MathRender";

export default function HistoryScreen() {
  const { equations, loadEquations } = useEquationStore();

  useEffect(() => {
    loadEquations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <FlatList
        data={equations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.rawInput}</Text>
            <MathRenderer expression={item.steps[item.steps.length - 1].latex} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
});
