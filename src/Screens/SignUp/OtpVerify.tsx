// OtpVerify.tsx
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import HeaderWithBackButton from '../../Components/Header/Header';
import {styles} from './Styles';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {ProfileStackParamList} from './navigation-types';
import {CricketBackground} from '../../Components/BackgroundImage/CricketBackround';
//@ts-ignore
import Icon from 'react-native-vector-icons/Octicons';
import {colors} from '../../Components/Colors';
import {Loader} from '../../Components/Loader/Loader';
import {otpApiCalling, resendOtpApiCalling} from './ApiFunction';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import AsyncStorageWrapper from '../../Components/AsyncStorage/AsyncStorageValue';
import {setToken} from '../../Redux/authReducer';
import {useDispatch} from 'react-redux';

type OtpVerificationRouteProp = RouteProp<
  ProfileStackParamList,
  'OtpVerification'
>;

interface OtpVerificationProps {
  route: OtpVerificationRouteProp; // Access the route prop to get params
}
const OtpVerify: React.FC<OtpVerificationProps> = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [showLoader, setshowLoader] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State for OTP values
  const inputs = useRef<Array<TextInput | null>>([]);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  const onResendClick = () => {
    setshowLoader(true);
    // Call the API
    resendOtpApiCalling(
      route.params.email,
      response => {
        setshowLoader(false);
        setAlertConfig({
          ...alertConfig,
          visible: true,
          type: 'success',
          title: 'Success!',
          message: 'Otp sent successfully.',
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
      },
    );
  };

  const handleInputChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      // Focus on the next input if available
      inputs.current[index + 1]?.focus();
    } else if (index === 5 && value) {
      // Check if all fields are filled
      if (newOtp.every(digit => digit !== '')) {
        console.log('all otp filled', newOtp);
        setshowLoader(true);

        // Combine the array into a single string and convert it to a number
        const otpNum = Number(newOtp.join(''));
        console.log('otpNum', otpNum);

        // Call the API
        otpApiCalling(
          route.params.email,
          otpNum,
          route.params.fromScreen,
          response => {
            setshowLoader(false);
            console.log('api response:', response);
            if (route.params.fromScreen == 'forgetpassword') {
              //@ts-expect-error
              navigation.navigate('LoginRoute', {
                screen: 'ForgotPasswordScreen',
                params: {email: route.params.email},
              });
            } else {
              saveLoginSession(true, response?.data?.token);
              dispatch(setToken(response.data.token));

              //@ts-expect-error
              navigation.navigate('BottomTab', {screen: 'HomeRoute'});
            }
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
          },
        );
      } else {
        console.log('Incomplete OTP input');
      }
    }
  };

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

  const handleBackspace = (value: string, index: number) => {
    if (!value && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Clear the previous box value
      setOtp(newOtp);

      // Focus on the previous input
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/* <CricketBackground /> */}
        <HeaderWithBackButton
          title="Otp Verification"
          onBackButton={() => navigation.goBack()}
        />
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

        <View style={styles.imageContainer}>
          <Icon name="number" color={colors.scarletRed} size={150} />
        </View>

        <View style={styles.otpContainer}>
          <View style={styles.otpTitleContainer}>
            <Text style={styles.otpTitle}>Enter OTP</Text>

            <Text style={styles.otpSubtitle}>
              Please enter otp sent to your email id.
            </Text>
          </View>
          <View style={styles.otpViewContainer}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputs.current[index] = ref)} // Assign refs
                  style={styles.otpBoxContainer}
                  value={otp[index]}
                  maxLength={1} // Limit each box to 1 character
                  keyboardType="numeric"
                  onChangeText={value => handleInputChange(value, index)}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(otp[index], index);
                    }
                  }}
                />
              ))}
          </View>

          <TouchableOpacity
            style={styles.resendOtpContainer}
            onPress={() => onResendClick()}>
            <Text style={styles.resendOTPText}>Resend OTP ?</Text>
          </TouchableOpacity>
        </View>

        <Loader visible={showLoader} />
      </View>
    </SafeAreaView>
  );
};
export default OtpVerify;
