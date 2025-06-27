// Comando para compilar el proyecto "desde un build"
// npx expo run:android

import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TextInput, StyleSheet } from "react-native";
import { solveExpression } from "./src/features/core/algebra/steps";
import { RuleStep } from "./src/features/core/types/RuleStep";
import { MathRenderer } from "./MathRender";

export const DebugEquationSolver = () => {
  const [steps, setSteps] = useState<RuleStep[]>([]);
  const [input, setInput] = useState<string>("2*x + 3 = 7");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const result = solveExpression(input);
      setSteps(result);
      setError("");
    } catch (e: any) {
      console.error("Error resolviendo ecuación:", e);
      setSteps([]);
      setError("Ecuación inválida");
    }
  }, [input]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Equation Solver</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa una ecuación (ej: 2*x+3=7)"
        value={input}
        onChangeText={setInput}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        steps.map((step) => (
          <View key={step.stepNumber} style={styles.step}>
            <Text style={styles.stepTitle}>
              Paso {step.stepNumber}: {step.description}
            </Text>
            <MathRenderer expression={step.latex} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  error: { color: "red", marginBottom: 20 },
  step: { marginBottom: 24 },
  stepTitle: { fontWeight: "bold", marginBottom: 6 },
});
