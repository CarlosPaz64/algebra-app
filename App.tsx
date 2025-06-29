if (typeof window !== "undefined") {
  require("katex/dist/katex.min.css");
}

import React from "react";
import { SafeAreaView } from "react-native";
import RootNavigator from "./src/navigation/RootNavigation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <RootNavigator />
    </SafeAreaView>
  );
}
