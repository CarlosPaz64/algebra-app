import React from "react";
import { View, Platform } from "react-native";

export const MathRenderer = ({ expression }: { expression: string }) => {
  if (Platform.OS === "web") {
    const { BlockMath } = require("react-katex");
    return (
      <View style={{ padding: 12 }}>
        <BlockMath math={expression} />
      </View>
    );
  }

  // Android / iOS
  const MathView = require("react-native-math-view").default;

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
      <MathView
        math={expression}
        style={{ width: "100%", minHeight: 120 }}
      />
    </View>
  );
};
