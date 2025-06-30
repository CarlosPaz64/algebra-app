import React from "react";
import { View, StyleSheet } from "react-native";
import { Equation } from "../../../features/solver/domain/entities/Equation";
import { MathRenderer } from "../atoms/MathRender";
import { PrimaryButton } from "../../components/atoms/PrimaryButton";

interface Props {
  equation: Equation;
  onViewSteps: () => void;
  onDelete: () => void;
}

export const EquationCard = ({ equation, onViewSteps, onDelete }: Props) => {
  const resultLatex = equation.steps.at(-1)?.latex || "";

  return (
    <View style={styles.card}>
      <MathRenderer expression={resultLatex} />
      <View style={styles.buttons}>
        <PrimaryButton title="Ver pasos" onPress={onViewSteps} />
        <PrimaryButton title="Eliminar" onPress={onDelete} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
