import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  View,
  Platform,
} from 'react-native';
import {loginStyles} from './styles';
import {CricketBackground} from '../../Components/BackgroundImage/CricketBackround';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../Components/Colors';
import {EmailInput} from '../../Components/Input/ProfileInput';
import {LoginButton} from '../../Components/Button/LoginButton';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {forgotPasswordApiCalling} from './ApiFunction';
import {Loader} from '../../Components/Loader/Loader';

export default function EmailScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });
  const [showLoader, setshowLoader] = useState(false);

  const OnButtonClick = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setAlertConfig(prev => ({
        ...prev,
        visible: true,
        type: 'validation',
        title: 'Validation Failed!',
        message: 'Please enter your email.',
      }));
      return;
    } else if (!emailRegex.test(email)) {
      setAlertConfig(prev => ({
        ...prev,
        visible: true,
        type: 'validation',
        title: 'Validation Failed!',
        message: 'Please enter a valid email.',
      }));
      return;
    } else {
      setshowLoader(true);
      forgotPasswordApiCalling(
        email,
        response => {
          setshowLoader(false);
          //@ts-ignore
          navigation.navigate('ProfileRoute', {
            screen: 'OtpVerification',
            params: {email: email, fromScreen: 'forgetpassword'},
          });
        },
        error => {
          setshowLoader(false);
          setAlertConfig(prev => ({
            ...prev,
            visible: true,
            type: 'error',
            title: 'Error!',
            message: error,
          }));
        },
        onStatusFalse => {
          setshowLoader(false);

          if (onStatusFalse.data.already_register) {
            setAlertConfig(prev => ({
              ...prev,
              visible: true,
              type: 'error',
              title: 'Error!',
              message: onStatusFalse.data.message,
            }));
          } else {
            //@ts-ignore
            navigation.navigate('ProfileRoute', {
              screen: 'ProfileScreen',
              params: {email: email},
            });
          }
        },
      );
    }
  };

  return (
    // <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={[loginStyles.container, {paddingTop: Platform.OS === 'ios' ? 50 : 20}]}>
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

        <HeaderWithBackButton
          title="Email Verification"
          onBackButton={() => navigation.goBack()}
        />

        <View style={loginStyles.imageContainer}>
          <Image
            source={require('../../Assets/login_logo.png')}
            style={loginStyles.logoImage}
          />
        </View>

        <EmailInput
          placeholder="Enter your email"
          iconName="envelope"
          nameValue={email}
          onChangeOfText={setEmail}
        />

        <View style={loginStyles.nextButtonContainer}>
          <LoginButton buttonText="Next" buttonClick={OnButtonClick} />
        </View>

        <Loader visible={showLoader} />
      </View>
    // </SafeAreaView>
  );
}
