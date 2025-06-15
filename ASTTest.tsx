import React from "react";
import { ScrollView, Text, View } from "react-native";
import { MathRenderer } from "./MathRender";

const examples: { label: string; latex: string }[] = [
  { label: "LiteralNode", latex: "42" },
  { label: "VariableNode", latex: "y" },
  { label: "OperatorNode (+)", latex: "a + b + c" },
  { label: "OperatorNode (-)", latex: "7 - x" },
  { label: "OperatorNode (*)", latex: "4 \\cdot (x + 1)" },
  { label: "OperatorNode (/)", latex: "\\frac{2x + 1}{5}" },
  { label: "OperatorNode (=)", latex: "x^2 + 3x + 2 = 0" },
  { label: "FunctionNode (sqrt)", latex: "\\sqrt{(x + 1)^2}" },
  { label: "FunctionNode (nthRoot)", latex: "\\sqrt[4]{81}" },
  { label: "FunctionNode (log + sin)", latex: "\\log{100} + \\sin{\\frac{\\pi}{2}}" },
  { label: "FunctionNode (abs)", latex: "\\left| \\frac{-3x}{2} \\right|" },
  { label: "GroupingNode (nested)", latex: "\\left( \\frac{2x + 1}{\\sqrt{y^2 + 1}} \\right)^3" },
  { label: "Complex Mix", latex: "\\frac{\\left(2x + 3\\right)^2}{\\sqrt{4y}} + \\log{10}" },
];


export const DebugASTRenderer = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {examples.map(({ label, latex }, index) => (
        <View key={index} style={{ marginBottom: 32}}>
          <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 16 }}>{label}</Text>
          <MathRenderer expression={latex} />
        </View>
      ))}
    </ScrollView>
  );
};