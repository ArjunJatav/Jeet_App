import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {loginStyles} from './styles';
import {
  EmailInput,
  NameInput,
  PasswordInput,
} from '../../Components/Input/ProfileInput';
import {LoginButton} from '../../Components/Button/LoginButton';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {Loader} from '../../Components/Loader/Loader';
import {loginApiCalling} from './ApiFunction';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LoginStackParamList} from './navigation-types';
import {CricketBackground} from '../../Components/BackgroundImage/CricketBackround';
import {colors} from '../../Components/Colors';
import AsyncStorageWrapper from '../../Components/AsyncStorage/AsyncStorageValue';
import {setToken} from '../../Redux/authReducer';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import LoginSignButton from './LoginSignButton';
import {SignUpButton} from '../../Components/Button/ProfileButton';
import {signUpApiCalling} from '../SignUp/ApiFunction';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  LoginStackParamList,
  'LoginScreen',
  'ProfileRoute'
>;

interface LoginScreenProps {
  navigation: ProfileScreenNavigationProp;
}
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export default function LoginScreen({navigation}: LoginScreenProps) {
  const deviceFcmToken = useSelector(
    (state: RootState) => state.fcmToken.fcmToken,
  );
  const [authType, setAuthType] = useState('login');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    device_type: Platform.OS === 'ios' ? 'ios' : 'Android',
    device_token: deviceFcmToken ?? '',
  });
  const [signFormData, setSignFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showLoader, setshowLoader] = useState(false);
  const dispatch = useDispatch();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  const togglePasswordVisibility = () => {
    setPasswordVisibility(prev => {
      console.log('Previous Visibility:', prev);
      return !prev;
    });
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      device_type: Platform.OS === 'ios' ? 'ios' : 'Android',
      device_token: deviceFcmToken ?? '',
      [field]: value, // Update the specific field
    }));
  };
  const handleInputChange2 = (field: string, value: string) => {
    setSignFormData(prevData => ({
      ...prevData,
      device_type: Platform.OS === 'ios' ? 'ios' : 'Android',
      device_token: deviceFcmToken ?? '',
      [field]: value, // Update the specific field
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) return 'Please enter your email.';
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email.';
    if (!formData.password) return 'Please enter your password.';

    return null; // No validation errors
  };
  const validateForm2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signFormData.email) return 'Please enter your email.';
    if (!emailRegex.test(signFormData.email))
      return 'Please enter a valid email.';
    if (!signFormData.password) return 'Please enter your password.';

    return null;
  };

  // useEffect(() => {
  //   const initNotifications = async () => {
  //     await NotificationService.requestPermission();

  //     let fcmToken = await NotificationService.getFcmToken();
  //     console.log('Initial FCM Token:', fcmToken);

  //     if (!fcmToken) {
  //       console.log('FCM Token is null, updating...');
  //       await NotificationService.updateFcmToken(dispatch);
  //     } else {
  //       dispatch(setFcmToken(fcmToken));
  //     }

  //     const unsubscribeForeground =
  //       await NotificationService.listenToForegroundNotifications();
  //     NotificationService.setBackgroundMessageHandler();
  //     NotificationService.handleTokenRefresh(dispatch);

  //     return () => {
  //       unsubscribeForeground();
  //     };
  //   };

  //   initNotifications();
  // }, []);

  const saveLoginSession = async (value: boolean, token: string) => {
    try {
      const loginSuccess = await AsyncStorageWrapper.setItem(
        'USER_LOGIN_SESSION',
        value,
      );
      const tokenSuccess = await AsyncStorageWrapper.setItem(
        'USER_AUTH_TOKEN',
        token,
      );

      if (loginSuccess && tokenSuccess) {
        console.log(
          'Login session and auth token saved successfully!',
          loginSuccess && tokenSuccess,
        );
      } else {
        console.log('Failed to save login session or auth token.');
      }
    } catch (error) {
      console.error('Error saving login session:', error);
    }
  };

  const OnLogin = () => {
    const validationError = validateForm();
    if (validationError) {
      setAlertConfig({
        ...alertConfig,
        visible: true,
        type: 'validation',
        title: 'Validation Failed!',
        message: validationError,
      });
      return;
    }

    setshowLoader(true);
    loginApiCalling(
      formData,
      response => {
        saveLoginSession(true, response?.data?.token);
        setshowLoader(false);
        dispatch(setToken(response.data.token));
        console.log('login api response', response.data.token);
        //@ts-expect-error
        navigation.navigate('BottomTab', {screen: 'HomeRoute'});
      },
      error => {
        setshowLoader(false);
        setAlertConfig({
          ...alertConfig,
          visible: true,
          type: 'error',
          title: 'Error!',
          message: error,
        });
        console.log('Sign up error:', error);
        // Show alert or handle error
      },
      onStatusFalse => {
        setshowLoader(false);

        if (onStatusFalse.data.email_verified == 0) {
          //@ts-ignore
          navigation.navigate('OtpVerification', {
            email: formData.email,
            fromScreen: 'signup',
          });
        } else {
          setAlertConfig({
            ...alertConfig,
            visible: true,
            type: 'error',
            title: 'Error!',
            message: onStatusFalse.data.message,
          });
        }
        console.log('lohin up error: ==', onStatusFalse);
      },
    );
  };

  const OnRegister = () => {
    const validationError = validateForm2();
    if (validationError) {
      setAlertConfig({
        ...alertConfig,
        visible: true,
        type: 'validation',
        title: 'Validation Failed!',
        message: validationError,
      });
      return;
    }
    setshowLoader(true);
    signUpApiCalling(
      signFormData,
      response => {
        setshowLoader(false);
        navigation.navigate('OtpVerification', {
          email: signFormData.email,
          fromScreen: 'signup',
        });
      },
      error => {
        setshowLoader(false);
        setAlertConfig({
          ...alertConfig,
          visible: true,
          type: 'error',
          title: 'Error!',
          message: error,
        });
        console.log('Sign up error:', error);
        // Show alert or handle error
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={loginStyles.container}>
        <CricketBackground />
        <CustomAlert
          visible={alertConfig.visible}
          alertType={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
          numberOfButtons={alertConfig.numberOfButtons}
          onConfirm={() => setAlertConfig(prev => ({...prev, visible: false}))}
          onCancel={() => setAlertConfig(prev => ({...prev, visible: false}))}
        />

        <View
          style={[
            loginStyles.imageContainer,
            {
              // marginTop:
              // Platform.OS === 'ios' ? StatusBar.currentHeight || 20 : 0,
              // backgroundColor:"red"
            },
          ]}>
          <Image
            source={require('../../Assets/login_logo.png')}
            style={loginStyles.logoImage}
          />
          <Text
            style={[
              loginStyles.subTitle,
              {
                marginTop: 0,
                color: colors.white,
                fontSize: 24,
                fontWeight: '700',
              },
            ]}>
            Get Started now
          </Text>
          <Text
            style={[
              loginStyles.subTitle,
              {
                marginTop: 0,
                color: colors.white,
                fontSize: 15,
                fontWeight: '500',
              },
            ]}>
            {authType === 'login'
              ? 'Log in to explore about our app'
              : 'Create an account or log in to explore about our app'}
          </Text>
        </View>

        <View
          style={[
            // loginStyles.imageContainer,
            {
              backgroundColor: 'white',
              flex: 1,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            },
          ]}>
          <ScrollView
            contentContainerStyle={{paddingBottom: 100}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <LoginSignButton colors={colors} onSwitch={setAuthType} />
            {authType === 'login' ? (
              // <View style={styles.formContainer}>
              <>
                <Text style={[loginStyles.subTitle, {marginTop: 20}]}>
                  Email
                </Text>
                <EmailInput
                  placeholder="Enter your email"
                  iconName="envelope"
                  nameValue={formData.email}
                  onChangeOfText={(text: string) =>
                    handleInputChange('email', text)
                  }
                />
                <Text style={[loginStyles.subTitle, {marginTop: 10}]}>
                  Password
                </Text>
                <PasswordInput
                  placeholder="Enter your password"
                  iconName="lock"
                  secureText={!passwordVisibility}
                  toggleSecureText={togglePasswordVisibility}
                  nameValue={formData.password}
                  onChangeOfText={(text: string) =>
                    handleInputChange('password', text)
                  }
                />
                <View style={loginStyles.forgotpasswordContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EmailScreen')}>
                    <Text style={loginStyles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                <LoginButton
                  buttonText="Log In"
                  buttonClick={() => OnLogin()}
                />
              </>
            ) : (
              <>
                <Text style={[loginStyles.subTitle, {marginTop: 20}]}>
                  Name
                </Text>
                <NameInput
                  placeholder="Enter your name"
                  iconName="user-alt"
                  nameValue={signFormData.name}
                  onChangeOfText={(text: string) =>
                    handleInputChange2('name', text)
                  }
                />
                <Text style={[loginStyles.subTitle, {marginTop: 20}]}>
                  Email
                </Text>
                <EmailInput
                  placeholder="Enter your email"
                  iconName="envelope"
                  nameValue={signFormData.email}
                  onChangeOfText={(text: string) =>
                    handleInputChange2('email', text)
                  }
                />
                <Text style={[loginStyles.subTitle, {marginTop: 10}]}>
                  Password
                </Text>
                <PasswordInput
                  placeholder="Enter your password"
                  iconName="lock"
                  secureText={passwordVisibility}
                  toggleSecureText={togglePasswordVisibility}
                  nameValue={signFormData.password}
                  onChangeOfText={(text: string) =>
                    handleInputChange2('password', text)
                  }
                  // onsubmitEditing={Keyboard.dismiss()}
                />
                <Text style={[loginStyles.subTitle, {marginTop: 10}]}>
                  Confirm Password
                </Text>
                <PasswordInput
                  placeholder="Enter your password"
                  iconName="lock"
                  secureText={passwordVisibility}
                  toggleSecureText={togglePasswordVisibility}
                  nameValue={signFormData.confirmPassword}
                  onChangeOfText={(text: string) =>
                    handleInputChange2('confirmPassword', text)
                  }
                  // onsubmitEditing={Keyboard.dismiss()}
                />
                <Text style={[loginStyles.subTitle, {marginTop: 10}]}>
                  Referral Code (Optional)
                </Text>
                <NameInput
                  placeholder="Enter referral code (optional)"
                  iconName="key"
                  nameValue={signFormData.referralCode}
                  onChangeOfText={(text: string) =>
                    handleInputChange2('referralCode', text)
                  }
                />
                <View
                  style={[
                    loginStyles.forgotpasswordContainer,
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <Text
                    style={[
                      loginStyles.forgotPasswordText,
                      {
                        textAlign: 'center',
                        fontSize: 14,
                        color: colors.titleColor,
                        fontWeight: '400',
                      },
                    ]}>
                    By signing up, you agree to the{' '}
                    <Text style={{fontWeight: '600', color: colors.black}}>
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text style={{fontWeight: '600', color: colors.black}}>
                      Data Processing Agreement
                    </Text>
                    .
                  </Text>
                </View>

                <SignUpButton
                  buttonText="Create an account"
                  buttonClick={() => OnRegister()}
                />
              </>
            )}
          </ScrollView>
        </View>

        <Loader visible={showLoader} />
      </View>
    </TouchableWithoutFeedback>
  );
}
