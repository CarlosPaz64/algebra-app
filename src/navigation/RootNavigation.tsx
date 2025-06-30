
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../features/solver/presentation/views/HomeScreen";
import HistoryScreen from "../features/solver/presentation/views/HistoryScreen";
import StepByStepScreen from "../features/solver/presentation/views/StepByStepScreen";
import { Equation } from "../features/solver/domain/entities/Equation";
import Ionicons from '@expo/vector-icons/Ionicons';

export type RootStackParamList = {
  Tabs: undefined;
  StepByStep: { equation: Equation };
};

export type TabParamList = {
  Home: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "help";

        if (route.name === "Home") {
          iconName = "calculator";
        } else if (route.name === "History") {
          iconName = "time";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tabs.Screen name="Home" component={HomeScreen} options={{ title: "Calcula tu ecuación" }}/>
    <Tabs.Screen name="History" component={HistoryScreen} options={{ title: "Historial" }}/>
  </Tabs.Navigator>
);

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="StepByStep" component={StepByStepScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
