import React, { useEffect } from "react";
import { Text, ScrollView, View } from "react-native";
import { DistributiveRule } from "./src/features/core/algebra/rules/DistributiveRule";
import { TranspositionRule } from "./src/features/core/algebra/rules/TranspositionRule";
import { ASTToLatex } from "./src/features/core/algebra/latex/ASTToLatex";
import { ASTNode } from "./src/features/core/types/AST";

export const DebugASTRenderer = () => {
  useEffect(() => {
    console.log("Iniciando pruebas de reglas...");

    const distributiveAST: ASTNode = {
      type: "Operator",
      operator: "*",
      left: { type: "Literal", value: 2 },
      right: {
        type: "Operator",
        operator: "+",
        left: { type: "Variable", name: "x" },
        right: { type: "Literal", value: 3 },
      },
    };

    const distRule = new DistributiveRule();
    const distResult = distRule.apply(distributiveAST);

    console.log("Distributiva aplicada:");
    console.log("AST:", JSON.stringify(distResult, null, 2));
    console.log("LaTeX:", distResult ? ASTToLatex(distResult) : "No se aplicó");

    const transpositionAST: ASTNode = {
      type: "Operator",
      operator: "=",
      left: {
        type: "Operator",
        operator: "+",
        left: { type: "Variable", name: "x" },
        right: { type: "Literal", value: 2 },
      },
      right: { type: "Literal", value: 5 },
    };

    const transpRule = new TranspositionRule();
    const transpResult = transpRule.apply(transpositionAST);

    console.log("Transposición aplicada:");
    console.log("AST:", JSON.stringify(transpResult, null, 2));
    console.log("LaTeX:", transpResult ? ASTToLatex(transpResult) : "No se aplicó");

  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Prueba de las reglas</Text>
      <Text>Revisa la consola para ver el resultado de aplicar las reglas.</Text>
    </ScrollView>
  );
};
