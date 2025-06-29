import React, { useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEquationStore } from "../UseEquationStore";
import { MathRenderer } from "../../../../../MathRender";
import { Equation } from "../../domain/entities/Equation";
import { RootStackParamList } from "../../../../navigation/RootNavigation";

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { equations, loadEquations, deleteEquation, clearAll } = useEquationStore();

  useEffect(() => {
    loadEquations();
  }, []);

  const confirmDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta ecuación?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", onPress: () => deleteEquation(id) },
    ]);
  };

  const confirmClearAll = () => {
    Alert.alert("Eliminar todo", "¿Deseas borrar todo el historial?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: clearAll },
    ]);
  };

  if (equations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Historial vacío</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Historial de Ecuaciones</Text>
      {equations.map((eq: Equation) => (
        <View key={eq.id} style={styles.card}>
          <MathRenderer expression={eq.steps.at(-1)?.latex || ""} />
          <View style={styles.buttons}>
            <Button
              title="Ver pasos"
              onPress={() => navigation.navigate("StepByStep", { equation: eq })}
            />
            <Button
              title="Eliminar"
              color="red"
              onPress={() => confirmDelete(eq.id)}
            />
          </View>
        </View>
      ))}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Borrar todo el historial"
          onPress={confirmClearAll}
          color="darkred"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
