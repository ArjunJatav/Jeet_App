// Rename the file to index.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginRoute from "../Login";
import { SplashStackParamList } from "./navigation-types";
import SplashScreen from "./SplashScreen";
import HomeRoute from "../HomeScreen";



const SplashStack = createNativeStackNavigator<SplashStackParamList>();

export default function SplashRoute() {
  return (
    <SplashStack.Navigator screenOptions={{ headerShown: false }}>
      <SplashStack.Screen name="SplashScreen" component={SplashScreen} />
      <SplashStack.Screen name="LoginRoute" component={LoginRoute} />
      <SplashStack.Screen name="HomeRoute" component={HomeRoute} />
    </SplashStack.Navigator>
  );
}
