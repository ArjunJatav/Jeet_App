// DrawerNav.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNav from './bottmNav';

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator
      initialRouteName="BottomNav"
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="BottomNav" component={BottomNav} />
    </Drawer.Navigator>
  );
}
