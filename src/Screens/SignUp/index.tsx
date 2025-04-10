// Rename the file to index.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ProfileScreen from "./ProfileScreen";
import OtpVerify from "./OtpVerify";
import { ProfileStackParamList } from "./navigation-types";

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileRoute() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="OtpVerification" component={OtpVerify} />
    </ProfileStack.Navigator>
  );
}
