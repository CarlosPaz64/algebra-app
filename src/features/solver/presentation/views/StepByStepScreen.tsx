import React from "react";
import { View, ScrollView, Button, Text, StyleSheet } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/RootNavigation";
import { useEquationStore } from "../UseEquationStore";
import { MathRenderer } from "../../../../../MathRender";

export default function StepByStepScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "StepByStep">>();
  const navigation = useNavigation();
  const { saveEquation } = useEquationStore();

  const { equation } = route.params;

  const handleSave = () => {
    saveEquation(equation);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paso a Paso</Text>
      {equation.steps.map((step) => (
        <View key={step.stepNumber} style={styles.step}>
          <Text style={styles.stepTitle}>
            Paso {step.stepNumber}: {step.description}
          </Text>
          <MathRenderer expression={step.latex} />
        </View>
      ))}
      <Button title="Guardar ecuación" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  step: { marginBottom: 24 },
  stepTitle: { fontWeight: "bold", marginBottom: 6 },
});
