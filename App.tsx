if (typeof window !== "undefined") {
  require("katex/dist/katex.min.css");
}
import { DebugASTRenderer } from './ASTTest';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <DebugASTRenderer />
    </SafeAreaView>
  );
}
