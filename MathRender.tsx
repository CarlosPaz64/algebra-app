import React from "react";
import { Platform, View } from "react-native";
import MathView from "react-native-math-view";

export const MathRenderer = ({ expression }: { expression: string }) => {
  if (Platform.OS === "web") {
    const { BlockMath } = require("react-katex");
    return (
      <View style={{ padding: 12 }}>
        <BlockMath math={expression} />
      </View>
    );
  }

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
        resizeMode="contain"
        style={{
          width: "100%",
          minHeight: 50,
        }}
      />
    </View>
  );
};
