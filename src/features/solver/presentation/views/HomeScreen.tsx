import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { solveStepByStep } from "../../../core/algebra/rules/StepByStepRules";
import { Equation } from "../../domain/entities/Equation";
import { MathRenderer } from "../../../../shared/components/atoms/MathRender";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/RootNavigation";

export default function HomeScreen() {
  const [input, setInput] = useState("2*x + 3 = 7");
  const [latex, setLatex] = useState("");
  const [equation, setEquation] = useState<Equation | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

const cleanInput = (str: string) =>
  str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim(); // limpia caracteres invisibles

const handleSolve = () => {
  try {
    const sanitized = cleanInput(input);
    const steps = solveStepByStep(sanitized);
    const finalStep = steps[steps.length - 1];

    const newEquation: Equation = {
      id: Date.now().toString(),
      rawInput: sanitized,
      parsed: finalStep.ast,
      steps,
      solved: true,
      createdAt: new Date().toISOString(),
    };

    setEquation(newEquation);

    // Si hay múltiples ramas, renderiza todas
    if (Array.isArray(finalStep.ast)) {
      const allLatex = finalStep.ast.map((branch: any) => branch.latex || "").join(" \\quad ");
      setLatex(allLatex);
    } else {
      setLatex(finalStep.latex);
    }

  } catch (e) {
    console.error("❌ Error al resolver:", e);
  }
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ingresa la ecuación a resolver:</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ej: 2*x + 3 = 7"
      />
      <Button title="Resolver" onPress={handleSolve} />
      {latex && equation ? (
        <View style={styles.result}>
          <Text>Resultado:</Text>
          <MathRenderer expression={latex} />
          <Button
            title="Mostrar pasos"
            onPress={() => navigation.navigate("StepByStep", { equation })}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: "#ccc",
    borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 18,
  },
  result: { marginTop: 20 },
});
