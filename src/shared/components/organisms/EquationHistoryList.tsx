import React, { useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Button, Alert } from "react-native";
import { useEquationStore } from "../../../features/solver/presentation/context/UseEquationStore";
import { EquationCard } from "../../../shared/components/molecules/EquationCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigation";


export const EquationHistoryList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { equations, loadEquations, deleteEquation, clearAll } = useEquationStore();

    useEffect(() => {
        loadEquations();
    }, []);

    const confirmDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Eliminar esta ecuación?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", onPress: () => deleteEquation(id) },
        ]);
    };

    const confirmClearAll = () => {
        Alert.alert("Eliminar todo", "¿Deseas borrar todo el historial?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sí", onPress: clearAll },
        ]);
    };

    if (equations.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Historial vacío</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Historial de Ecuaciones</Text>
            {equations.map((eq) => (
                <EquationCard
                    key={eq.id}
                    equation={eq}
                    onViewSteps={() => navigation.navigate("StepByStep", { equation: eq })}
                    onDelete={() => confirmDelete(eq.id)}
                />
            ))}
            <View style={{ marginTop: 20 }}>
                <Button title="Borrar todo el historial" onPress={confirmClearAll} color="darkred" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
});
