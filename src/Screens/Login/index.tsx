// Rename the file to index.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "./LoginScreen";
import { LoginStackParamList } from "./navigation-types";
import ForgotPasswordScreen from "./ForgotPassword";
import EmailScreen from "./EmailScreen";
import ProfileRoute from "../SignUp";
import OtpVerify from "../SignUp/OtpVerify";


const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginRoute() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
      <LoginStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <LoginStack.Screen name="EmailScreen" component={EmailScreen} />
      <LoginStack.Screen name="ProfileRoute" component={ProfileRoute} />
      <LoginStack.Screen name="OtpVerification" component={OtpVerify}/>
      {/* <StackNav.Screen name="ProfileRoute" component={ProfileRoute} /> */}
    </LoginStack.Navigator>
  );
}
