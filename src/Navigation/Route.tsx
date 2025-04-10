import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import BottomNav from '../BottomTab/bottmNav';
import SplashRoute from '../Screens/SplashScreen';
import LoginRoute from '../Screens/Login';
import ProfileRoute from '../Screens/SignUp';
import DrawerNav from '../BottomTab/DrawerNav';

export default function Route() {
  const StackNav = createNativeStackNavigator();
  return (
    <StackNav.Navigator screenOptions={{headerShown: false}}>
      <StackNav.Screen name="SplashRoute" component={SplashRoute} />
      <StackNav.Screen name="LoginRoute" component={LoginRoute} />
      <StackNav.Screen name="ProfileRoute" component={ProfileRoute} />
      <StackNav.Screen name="BottomTab" component={BottomNav} />
      <StackNav.Screen name="DrawerNav" component={DrawerNav} />
    </StackNav.Navigator>
  );
}
