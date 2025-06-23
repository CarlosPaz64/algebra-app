import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TextInput } from "react-native";
import { parse } from "./src/features/core/algebra/parser";
import { RuleEngine } from "./src/features/core/algebra/steps/RuleEngine";
import { allRules } from "./src/features/core/algebra/rules/AllMyRules";
import { RuleStep } from "./src/features/core/types/RuleStep";
import { MathRenderer } from "./MathRender";
import { formatNodeCompact } from "./src/features/core/algebra/utils/Format";

export const DebugASTRenderer = () => {
  const [steps, setSteps] = useState<RuleStep[]>([]);
  const [finalFormatted, setFinalFormatted] = useState<string>("");
  const [input, setInput] = useState("2(x + 3)^2");

  useEffect(() => {
    try {
      const ast = parse(input);
      console.log("📌 AST inicial:", JSON.stringify(ast, null, 2));

      const engine = new RuleEngine(allRules);
      const generatedSteps = engine.applyAll(ast);

      setSteps(generatedSteps);

      const finalAST = engine.getLatestAST();
      const formatted = formatNodeCompact(finalAST);
      setFinalFormatted(formatted);
    } catch (error) {
      console.error("❌ Error al procesar la expresión:", error);
      setSteps([]);
      setFinalFormatted("Expresión inválida");
    }
  }, [input]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Resolución paso a paso:
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
          fontSize: 18,
        }}
        placeholder="Ingresa una expresión (ej: 2(x + 3)^2)"
        value={input}
        onChangeText={setInput}
      />

      {steps.length === 0 ? (
        <Text style={{ color: "red" }}>
          No se aplicaron reglas. Verifica la expresión.
        </Text>
      ) : (
        <>
          {steps.map((step) => (
            <View key={step.stepNumber} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                Paso {step.stepNumber}: {step.description}
              </Text>
              <MathRenderer expression={step.latex} />
            </View>
          ))}

          <View
            style={{
              marginTop: 30,
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
              Resultado final:
            </Text>
            <MathRenderer
              expression={finalFormatted.replace(/(\d)([a-zA-Z])/g, "$1\\cdot $2")}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};
