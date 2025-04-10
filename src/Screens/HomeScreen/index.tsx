import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './HomeScreen';
import ContestDetails from './ContestDetails';
import { HomeParamList } from './navigation-types';
import CreateTeamScreen from './CreateTeam';
import SelectCaptainScreen from './SelectCaptainScreen';
import TeamPreviewScreen from './TeamPreviewScreen';
import TermsandConditonScreen from '../ProfileScreen/TermsAndCondition';
import NotificationScreen from '../ProfileScreen/Notification';
import WalletWithdrawScreen from '../ProfileScreen/WalletWithdraw';

const HomeStack = createNativeStackNavigator<HomeParamList>();

export default function HomeRoute() {
  return (
    
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="ContestDetails" component={ContestDetails}  />
      <HomeStack.Screen name="CreateTeamScreen" component={CreateTeamScreen} />
      <HomeStack.Screen name="SelectCaptainScreen" component={SelectCaptainScreen} />
      <HomeStack.Screen name="TeamPreviewScreen" component={TeamPreviewScreen} />
      <HomeStack.Screen name="TermsandConditonScreen" component={TermsandConditonScreen} />
      <HomeStack.Screen name="NotificationScreen" component={NotificationScreen} />
      <HomeStack.Screen name="WalletWithdrawScreen" component={WalletWithdrawScreen} />
    </HomeStack.Navigator>
  );
}
