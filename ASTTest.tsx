// Comando para compilar el proyecto "desde un build"
// npx expo run:android

import React, { useState } from "react";
import {
  ScrollView, Text, View,
  TextInput, StyleSheet, Button
} from "react-native";
import { solveExpression }    from "./src/features/core/algebra/steps";
import { solveStepByStep } from "./src/features/core/algebra/rules/StepByStepRules";
import { RuleStep }           from "./src/features/core/types/RuleStep";
import { MathRenderer }       from "./MathRender";

export const DebugEquationSolver = () => {
  const [input, setInput] = useState("2*x + 3 = 7");
  const [steps, setSteps] = useState<RuleStep[]>([]);
  const [error, setError] = useState("");

  const handleShowAll = () => {
    try {
      // 1) aplicamos las reglas paso a paso
      const ruleSteps = solveStepByStep(input);

      // 2) obtenemos el resultado directo
      const direct = solveExpression(input);
      const finalStep = direct[direct.length - 1];

      // 3) si el último paso de reglas ya coincide con el final, no lo repetimos
      const lastRuleAst = ruleSteps[ruleSteps.length - 1]?.ast;
      const sameEnding =
        lastRuleAst && JSON.stringify(lastRuleAst) === JSON.stringify(finalStep.ast);

      // 4) combinamos
      const all = sameEnding
        ? ruleSteps
        : [
            ...ruleSteps,
            { ...finalStep, stepNumber: ruleSteps.length },
          ];

      setSteps(all);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setSteps([]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Equation Solver</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: 2*x+3=7"
        value={input}
        onChangeText={setInput}
      />

      <View style={styles.buttons}>
        <Button title="Mostrar todo" onPress={handleShowAll} />
      </View>

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
  title:     { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input:     { borderWidth:1, borderColor:"#ccc", borderRadius:8, padding:10, marginBottom:12, fontSize:18 },
  buttons:   { marginBottom:20, alignSelf:"flex-start" },
  error:     { color:"red", marginBottom:20 },
  step:      { marginBottom:24 },
  stepTitle: { fontWeight:"bold", marginBottom:6 },
});
