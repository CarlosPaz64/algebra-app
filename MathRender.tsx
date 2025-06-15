import React from "react";
import { Platform, View } from "react-native";

let WebLatex: React.FC<{ expression: string }> | null = null;

if (Platform.OS === "web") {
  const { BlockMath } = require("react-katex");
  WebLatex = ({ expression }) => (
    <View style={{ padding: 12 }}>
      <BlockMath math={expression} />
    </View>
  );
}

const NativeLatex =
  Platform.OS !== "web" ? require("react-native-katex").default : null;

export const MathRenderer = ({ expression }: { expression: string }) => {
  if (Platform.OS === "web" && WebLatex) {
    return <WebLatex expression={expression} />;
  }

if (NativeLatex) {
  return (
    <View
      style={{
        marginVertical: 16,
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 220,
      }}
    >
      <View style={{ transform: [{ scale: 2 }] }}>
        <NativeLatex expression={expression} />
      </View>
    </View>
  );
}


  return null;
};