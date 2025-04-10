  /**
   * Sample React Native App
   * https://github.com/facebook/react-native
   *
   * @format
   */

  import {NavigationContainer} from '@react-navigation/native';
  import {createNativeStackNavigator} from '@react-navigation/native-stack';
  import React, {useEffect} from 'react';

  import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
  } from 'react-native';

  import {Colors} from 'react-native/Libraries/NewAppScreen';
  import Route from './src/Navigation/Route';
  import { useDispatch} from 'react-redux';
  import { setFcmToken } from './src/Redux/fcmToken';
  import NotificationService from './src/Components/Utils/NotificationDisplay';

  import { getApps } from "firebase/app";
console.log("Firebase Apps:", getApps());

  function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const StackNav = createNativeStackNavigator();
    const dispatch = useDispatch();

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : 'transparent',
      flex: 1,
    };

    useEffect(() => {
      let unsubscribeForeground :any;
      let unsubscribeTokenRefresh :any;
    
      const initNotifications = async () => {
        console.log('Initial FCM Token:');
    const Persimmion =     await NotificationService.requestPermission();
        console.log('Persimmion', Persimmion);
        let fcmToken = await NotificationService.getFcmToken();
        console.log('Initial FCM Token:', fcmToken);
    
        if (!fcmToken) {
          console.log('FCM Token is null, updating...');
          await NotificationService.updateFcmToken(dispatch);
        } else {
          dispatch(setFcmToken(fcmToken));
        }
    
        unsubscribeForeground = await NotificationService.listenToForegroundNotifications();
        NotificationService.setBackgroundMessageHandler();
        unsubscribeTokenRefresh = NotificationService.handleTokenRefresh(dispatch);
      };
    
      initNotifications();
    
      return () => {
        if (unsubscribeForeground) {
          unsubscribeForeground();
        }
        if (unsubscribeTokenRefresh) {
          unsubscribeTokenRefresh();
        }
      };
    }, []);

    return (
      <>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        <NavigationContainer>
          <StackNav.Navigator screenOptions={{headerShown: false}}>
            <StackNav.Screen name="Route" component={Route} />
          </StackNav.Navigator>
        </NavigationContainer>
      </>
    );
  }

  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });

  export default App;
