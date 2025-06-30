import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MathRenderer } from "../atoms/MathRender";

interface Props {
  stepNumber: number;
  description: string;
  latex: string;
}

export const StepItem = ({ stepNumber, description, latex }: Props) => {
  return (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>
        Paso {stepNumber}: {description}
      </Text>
      <MathRenderer expression={latex} />
    </View>
  );
};

const styles = StyleSheet.create({
  step: { marginBottom: 24 },
  stepTitle: { fontWeight: "bold", marginBottom: 6 },
});
