import React from "react";
import { View, Text, ScrollView, Button, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/RootNavigation";
import { useEquationStore } from "../context/UseEquationStore";
import { StepByStepList } from "../../../../shared/components/organisms/StepByStepList";

export default function StepByStepScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "StepByStep">>();
  const navigation = useNavigation();
  const { saveEquation } = useEquationStore();

  const equation = route.params?.equation;

  if (!equation) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay datos disponibles</Text>
      </View>
    );
  }

  const handleSave = async () => {
    await saveEquation(equation);
    Alert.alert("Guardado", "La ecuación fue guardada con éxito.");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paso a Paso</Text>
      <StepByStepList equation={equation} />
      <Button title="Guardar ecuación" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
});
