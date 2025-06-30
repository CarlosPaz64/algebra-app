import React from "react";
import { View, StyleSheet } from "react-native";
import { Equation } from "../../../features/solver/domain/entities/Equation";
import { StepItem } from "../molecules/StepItem";

interface Props {
  equation: Equation;
}

export const StepByStepList = ({ equation }: Props) => {
  return (
    <View style={styles.container}>
      {equation.steps.map((step, index) => (
        <StepItem
          key={index}
          stepNumber={step.stepNumber}
          description={step.description}
          latex={step.latex}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
});
