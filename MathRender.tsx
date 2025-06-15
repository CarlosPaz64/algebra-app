import React from "react";
import { Platform, View } from "react-native";

export const MathRenderer = ({ expression }: { expression: string }) => {
  if (Platform.OS === "web") {
    const { BlockMath } = require("react-katex");
    return (
      <View style={{ padding: 12 }}>
        <BlockMath math={expression} />
      </View>
    );
  }

  const NativeLatex = require("react-native-katex").default;

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 16,
      }}
    >
      <NativeLatex
        expression={expression}
        style={{
          width: "100%",
          minHeight: 120,
          transform: [{ scale: 4 }]
        }}
        contentStyle={{
          fontSize: 24,
        }}
      />
    </View>
  );
};
