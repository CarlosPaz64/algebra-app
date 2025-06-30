import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { solveStepByStep } from "../../../features/core/algebra/rules/StepByStepRules";
import { MathRenderer } from "../../../shared/components/atoms/MathRender";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigation";
import { Equation } from "../../../features/solver/domain/entities/Equation";

export const EquationSolverForm = () => {
  const [input, setInput] = useState("2*x + 3 = 7");
  const [latex, setLatex] = useState("");
  const [equation, setEquation] = useState<Equation | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSolve = () => {
    try {
      const steps = solveStepByStep(input);
      const finalStep = steps[steps.length - 1];

      const newEq: Equation = {
        id: Date.now().toString(),
        rawInput: input,
        parsed: finalStep.ast,
        steps,
        solved: true,
        createdAt: new Date().toISOString(),
      };

      setEquation(newEq);
      setLatex(finalStep.latex);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resolver Ecuación</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ej: 2*x + 3 = 7"
      />
      <Button title="Resolver" onPress={handleSolve} />
      {latex && equation && (
        <View style={styles.result}>
          <Text>Resultado:</Text>
          <MathRenderer expression={latex} />
          <Button
            title="Mostrar pasos"
            onPress={() => navigation.navigate("StepByStep", { equation: equation })}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: "#ccc",
    borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 18,
  },
  result: { marginTop: 20 },
});
