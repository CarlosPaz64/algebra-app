import React, { useEffect } from "react";
import { Text, ScrollView, View } from "react-native";
import { DistributiveRule } from "./src/features/core/algebra/rules/DistributiveRule";
import { TranspositionRule } from "./src/features/core/algebra/rules/TranspositionRule";
import { ASTToLatex } from "./src/features/core/algebra/latex/ASTToLatex";
import { ASTNode } from "./src/features/core/types/AST";
import { SimplifyLikeTermsRule } from "./src/features/core/algebra/rules/SimplifyLikeTermsRule";
import { FractionReductionRule } from "./src/features/core/algebra/rules/FractionReductionRule";
import { RemoveZeroRule } from "./src/features/core/algebra/rules/RemoveZeroRule";
import { IdentityRule } from "./src/features/core/algebra/rules/IdentityRule";
import { PowerToProductRule } from "./src/features/core/algebra/rules/PowerToProductRule";

export const DebugASTRenderer = () => {
  useEffect(() => {
    console.log("Iniciando pruebas de reglas...");

    /* PRUEBA DEL MÓDULO PARA LA REGLA DISTRIBUTIVA */
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

    /* PRUEBA DEL MÓDULO PARA LA REGLA DE TRANSPOSICIÓN */
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

    /* PRUEBA DEL MÓDULO PARA LA REGLA DE SIMPLIFICACIÓN */
    const simplifyAST: ASTNode = {
      type: "Operator",
      operator: "+",
      left: {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: 2 },
        right: { type: "Variable", name: "x" }
      },
      right: {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: 3 },
        right: { type: "Variable", name: "x" }
      }
    };

    const simplifyRule = new SimplifyLikeTermsRule();
    const simplifyResult = simplifyRule.apply(simplifyAST);

    console.log("Simplificación aplicada:");
    console.log("AST:", JSON.stringify(simplifyResult, null, 2));
    console.log("LaTeX:", simplifyResult ? ASTToLatex(simplifyResult) : "No se aplicó");

    const fractionAST: ASTNode = {
      type: "Operator",
      operator: "/",
      left: { type: "Literal", value: 4 },
      right: { type: "Literal", value: 8 }
    };

    const fractionRule = new FractionReductionRule();
    const fractionResult = fractionRule.apply(fractionAST);

    console.log("Reducción de fracción aplicada:");
    console.log("AST:", JSON.stringify(fractionResult, null, 2));
    console.log("LaTeX:", fractionResult ? ASTToLatex(fractionResult) : "No se aplicó");

    /* PRUEBA DE ELIMINACIÓN DE CEROS */
    const zeroAST: ASTNode = {
      type: "Operator",
      operator: "+",
      left: { type: "Variable", name: "x" },
      right: { type: "Literal", value: 0 }
    };

    const zeroRule = new RemoveZeroRule();
    const zeroResult = zeroRule.apply(zeroAST);

    console.log("Eliminación de ceros aplicada:");
    console.log("AST:", JSON.stringify(zeroResult, null, 2));
    console.log("LaTeX:", zeroResult ? ASTToLatex(zeroResult) : "No se aplicó");

    /* PRUEBA DE IDENTIDAD */
    const identityAST: ASTNode = {
      type: "Operator",
      operator: "*",
      left: { type: "Literal", value: 1 },
      right: { type: "Variable", name: "x" }
    };

    const identityRule = new IdentityRule();
    const identityResult = identityRule.apply(identityAST);

    console.log("Identidad aplicada:");
    console.log("AST:", JSON.stringify(identityResult, null, 2));
    console.log("LaTeX:", identityResult ? ASTToLatex(identityResult) : "No se aplicó");

    /* PRUEBA DEL MÓDULO DE POTENCIACIÓN */
    const powerAST: ASTNode = {
      type: "Operator",
      operator: "^",
      left: { type: "Variable", name: "x" },
      right: { type: "Literal", value: 3 }
    };

    const powerRule = new PowerToProductRule();
    const powerResult = powerRule.apply(powerAST);

    console.log("Potencia a producto aplicada:");
    console.log("AST:", JSON.stringify(powerResult, null, 2));
    console.log("LaTeX:", powerResult ? ASTToLatex(powerResult) : "No se aplicó");

  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Prueba de las reglas</Text>
      <Text>Revisa la consola para ver el resultado de aplicar las reglas.</Text>
    </ScrollView>
  );
};
