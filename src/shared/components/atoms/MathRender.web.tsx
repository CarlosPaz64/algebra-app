import React from "react";
import { View } from "react-native";
import { BlockMath } from "react-katex";

export const MathRenderer = ({ expression }: { expression: string }) => (
  <View style={{ padding: 12 }}>
    <BlockMath math={expression} />
  </View>
);
