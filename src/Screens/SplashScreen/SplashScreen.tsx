import React, {useEffect, useState} from 'react';
import {Dimensions, Image, SafeAreaView, StatusBar, View} from 'react-native';
import {colors} from '../../Components/Colors';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SplashStackParamList} from './navigation-types';
import AsyncStorageWrapper from '../../Components/AsyncStorage/AsyncStorageValue';
import { useDispatch } from 'react-redux';
import { setToken } from '../../Redux/authReducer';
import { imageBaseUrl } from '../../ConstantFiles/Api';
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp<SplashStackParamList>>();
  const dispatch = useDispatch();
  interface LoginSessionResult {
    isLoggedIn: boolean;
    authToken: string | null;
  }
  
  const getLoginSessionAndAuthToken = async (): Promise<LoginSessionResult> => {
    try {
      const sessionValue = await AsyncStorageWrapper.getItem<boolean>('USER_LOGIN_SESSION');
      const isLoggedIn = sessionValue === true;
        const authToken = await AsyncStorageWrapper.getItem<string>('USER_AUTH_TOKEN');
      if (authToken) {
        dispatch(setToken(authToken));
        console.log('Token dispatched to Redux:', authToken);
      }
      return { isLoggedIn, authToken };
    } catch (error) {
      console.error('Error retrieving login session or auth token:', error);
        return { isLoggedIn: false, authToken: null };
    }
  };
  

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { isLoggedIn, authToken } = await getLoginSessionAndAuthToken();
        console.log('Login session:', { isLoggedIn, authToken });
        setTimeout(() => {
          if (isLoggedIn) {
            console.log('User is logged in');
            //@ts-ignore
            navigation.navigate("BottomTab", { screen: "HomeRoute" });
          } else {
            console.log('User is not logged in');
            navigation.navigate('LoginRoute');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [navigation]); 

  return (
    <View
      style={{
        height:windowHeight,
        width: windowWidth,
        //   flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.darkBlue,
      }}>
      <StatusBar hidden={true} />
      <View style={{height: windowHeight, width: windowWidth}}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/Splash_Screen.png')}
          style={{height: windowHeight, width:windowWidth}}
        />
      </View>
    </View>
  );
}
