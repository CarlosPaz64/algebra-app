import React from "react";
import { Button } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  color?: string;
}

export const PrimaryButton = ({ title, onPress, color }: Props) => {
  return <Button title={title} onPress={onPress} color={color || "#007bff"} />;
};
