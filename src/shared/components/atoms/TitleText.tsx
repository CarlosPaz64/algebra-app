import React from "react";
import { Text, StyleSheet } from "react-native";

interface Props {
  children: React.ReactNode;
}

export const TitleText = ({ children }: Props) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
