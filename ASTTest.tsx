import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { parse } from "./src/features/core/algebra/parser";
import { RuleEngine } from "./src/features/core/algebra/steps/RuleEngine";
import { allRules } from "./src/features/core/algebra/rules/AllMyRules";
import { RuleStep } from "./src/features/core/types/RuleStep";
import { MathRenderer } from "./MathRender";

export const DebugASTRenderer = () => {
  const [steps, setSteps] = useState<RuleStep[]>([]);
  const input = "2(x + 3)^2";

  useEffect(() => {
    let mounted = true; // 👈 Protección contra llamadas después del desmontaje

    try {
      const ast = parse(input);
      console.log("📌 AST inicial:", JSON.stringify(ast, null, 2));

      const engine = new RuleEngine(allRules);
      const generatedSteps = engine.applyAll(ast);

      if (mounted) {
        setSteps(generatedSteps);
      }

      if (generatedSteps.length === 0) {
        console.warn("⚠️ No se aplicaron reglas. Verifica que allRules tenga las reglas adecuadas.");
      } else {
        console.log("📚 Pasos:");
        generatedSteps.forEach((step) => {
          console.log(`Paso ${step.stepNumber}: ${step.description}`);
          console.log(step.latex);
        });
      }
    } catch (error) {
      console.error("❌ Error al procesar la expresión:", error);
    }

    return () => {
      mounted = false; // 🧹 Limpieza para evitar estado después del desmontaje
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Resolución paso a paso de: {input}
      </Text>

      {steps.length === 0 ? (
        <Text style={{ color: "red" }}>
          No se aplicaron reglas. Asegúrate de incluir todas en <Text style={{ fontWeight: "bold" }}>allRules</Text> (ej. <Text style={{ fontWeight: "bold" }}>ExpandPowerOfSumRule</Text>)
        </Text>
      ) : (
        steps.map((step) => (
          <View key={step.stepNumber} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Paso {step.stepNumber}: {step.description}
            </Text>
            <MathRenderer expression={step.latex} />
          </View>
        ))
      )}
    </ScrollView>
  );
};
