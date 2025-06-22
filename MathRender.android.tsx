import React from "react";
import { View } from "react-native";
import MathView from "react-native-math-view";

export const MathRenderer = ({ expression }: { expression: string }) => (
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
