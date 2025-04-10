import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeRoute from '../Screens/HomeScreen';
import AccountRoute from '../Screens/ProfileScreen'; // Your Profile Screen
import MatchesRoute from '../Screens/MyContestScreen'; // Your My Contest Screen
import {colors} from '../Components/Colors';
import {LOCALTEXT} from '../Language/AllTextProvider';
import {FontAwesome} from '../Components/ReactIcons/ReactIcon';
import HomeHeader from '../Components/Header/HomeHeader';
import ProfileSlideDrawer from '../Screens/ProfileScreen/ProfileSideDrawer';
import TermsandConditonScreen from '../Screens/ProfileScreen/TermsAndCondition';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import TransationHistoryScreen from '../Screens/ProfileScreen/TransationHistory';
import WithdrawRequestScreen from '../Screens/ProfileScreen/WithdrawRequest';
import UserFeedbackScreen from '../Screens/ProfileScreen/UserFeedback';
import InviteFriendsScreen from '../Screens/ProfileScreen/InviteFriend';

// Create the Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Create the Drawer Navigator
const Drawer = createDrawerNavigator();

export default function BottomNav() {
  return (
    <Drawer.Navigator
      drawerContent={props => <ProfileSlideDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Disable the header for the drawer
      }}>
      <Drawer.Screen
        name="Profile" // The screen name for the Bottom Tab Navigator
        component={BottomTabs}
      />

      <Drawer.Screen
        name="TermsandConditonScreen" // The screen name for the Bottom Tab Navigator
        component={TermsandConditonScreen}
      />
      <Drawer.Screen
        name="TransationHistoryScreen" // The screen name for the Bottom Tab Navigator
        component={TransationHistoryScreen}
      />
      <Drawer.Screen
        name="WithdrawRequestScreen" // The screen name for the Bottom Tab Navigator
        component={WithdrawRequestScreen}
      />
      <Drawer.Screen
        name="UserFeedbackScreen" // The screen name for the Bottom Tab Navigator
        component={UserFeedbackScreen}
      />
      <Drawer.Screen
        name="InviteFriendsScreen" // The screen name for the Bottom Tab Navigator
        component={InviteFriendsScreen}
      />
    </Drawer.Navigator>
  );
}

// BottomTabs Component with the Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false, // Hides headers for all tabs
        tabBarHideOnKeyboard: true, // Hides the tab bar when the keyboard is visible
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === LOCALTEXT.HOME) {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === LOCALTEXT.MY_CONTEST) {
            iconName = focused ? 'trophy' : 'trophy';
          } else if (route.name === LOCALTEXT.PROFILE) {
            iconName = focused ? 'user' : 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          display: getTabBarVisibility(route),
        },
        tabBarActiveTintColor: colors.scarletRed,
        tabBarInactiveTintColor: colors.modalOpacity,
      })}>
      <Tab.Screen
        name={LOCALTEXT.HOME}
        component={HomeRoute}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={LOCALTEXT.MY_CONTEST}
        component={MatchesRoute}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={LOCALTEXT.PROFILE}
        component={AccountRoute}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

// Helper Function to Control Tab Bar Visibility
function getTabBarVisibility(route:any) {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName === 'TermsandConditonScreen' ||
    routeName === 'AddBalanceScreen' ||
    routeName === 'CreateTeamScreen' ||
    routeName === 'SelectCaptainScreen' ||
    routeName === 'TeamPreviewScreen' ||
    routeName === 'ContestDetails' ||
    routeName === 'NotificationScreen' ||
    routeName === 'WalletWithdrawScreen' ||
    routeName === 'WithdrawRequestScreen' ||
    routeName === 'InviteFriendsScreen' ||
    routeName === 'UserFeedbackScreen' ||
    routeName === 'UpcommingContest' ||
    routeName === 'LiveContestScreen' ||
    routeName === 'CompleteContest' ||
    routeName === 'AllCompleteMatch' ||
    routeName === 'TransationHistoryScreen'

  ) {
    return 'none'; // Hide tab bar
  }
  return 'flex'; // Show tab bar
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
