import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AccountScreen from './ProfileScreen';
import TermsandConditonScreen from './TermsAndCondition';
import AddBalanceScreen from './AddBalance';
import TransationHistoryScreen from './TransationHistory';
import NotificationScreen from './Notification';
import WalletWithdrawScreen from './WalletWithdraw';
import AllCompleteMatch from './AllCompleMatch';

const AccountStack = createNativeStackNavigator();
export default function AccountRoute() {
  return (
    <AccountStack.Navigator screenOptions={{headerShown: false}}>
      <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
      <AccountStack.Screen
        name="TermsandConditonScreen"
        component={TermsandConditonScreen}
      />
      <AccountStack.Screen
        name="AddBalanceScreen"
        component={AddBalanceScreen}
      />
      <AccountStack.Screen
        name="TransationHistoryScreen"
        component={TransationHistoryScreen}
      />
      <AccountStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <AccountStack.Screen
        name="WalletWithdrawScreen"
        component={WalletWithdrawScreen}
      />
      <AccountStack.Screen
        name="AllCompleteMatch"
        component={AllCompleteMatch}
      />
    </AccountStack.Navigator>
  );
}
