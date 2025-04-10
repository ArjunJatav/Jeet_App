import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {loginStyles} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {RouteProp, useNavigation} from '@react-navigation/native';
//@ts-ignore
import Icon from 'react-native-vector-icons/FontAwesome5';
import {PasswordInput} from '../../Components/Input/ProfileInput';
import {LoginButton} from '../../Components/Button/LoginButton';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {CricketBackground} from '../../Components/BackgroundImage/CricketBackround';
import {colors} from '../../Components/Colors';
import {LoginStackParamList} from './navigation-types';
import {Loader} from '../../Components/Loader/Loader';
import {resetPasswordApiCalling} from './ApiFunction';

type OtpVerificationRouteProp = RouteProp<
  LoginStackParamList,
  'ForgotPasswordScreen'
>;

interface ForgotPasswordProps {
  route: OtpVerificationRouteProp; // Access the route prop to get params
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({route}) => {
  const navigation = useNavigation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility); // Toggle visibility state
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility); // Toggle visibility state
  };
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value, // Update the specific field
    }));
  };

  const validateForm = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])(?=.{8,})/;

    if (!formData.password) return 'Please enter password.';
    if (!passwordRegex.test(formData.password))
      return 'Password must contain at least one uppercase letter, one number, one special character, and be 8+ characters long.';
    if (!formData.confirmPassword) return 'Please enter confirm password.';
    if (!passwordRegex.test(formData.confirmPassword))
      return 'Password must contain at least one uppercase letter, one number, one special character, and be 8+ characters long.';
    if (formData.password != formData.confirmPassword) {
      return 'Password and confirm password must be same.';
    }
    return null; // No validation errors
  };

  const OnButtonClick = () => {
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
    resetPasswordApiCalling(
      route.params.email,
      formData.password,
      response => {
        setshowLoader(false);
        // console.log('forgotPasswordApiCalling response', response);
        //@ts-expect-error
        navigation.navigate('LoginScreen');
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
        // console.log('Sign up error:', error);
        // Show alert or handle error
      },
      onStatusFalse => {
        setshowLoader(false);

        if (onStatusFalse.data.already_register) {
          setAlertConfig({
            ...alertConfig,
            visible: true,
            type: 'error',
            title: 'Error!',
            message: onStatusFalse.data.message,
          });
        } else {
          //@ts-ignore
          navigation.navigate('ProfileRoute', {
            screen: 'ProfileScreen',
            params: {email: route.params.email},
          });
        }
        // console.log('lohin up error: ==', onStatusFalse);
      },
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
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

        <HeaderWithBackButton
          title="Forgot Password"
          onBackButton={() => navigation.goBack()}
        />
        <View style={loginStyles.imageContainer}>
          <Icon name="unlock-alt" size={100} color={colors.darkBlue} />
        </View>

        {/* ////////////////////////password-container////////////////////// */}
        <PasswordInput
          placeholder="Enter password"
          iconName="lock"
          secureText={passwordVisibility}
          toggleSecureText={togglePasswordVisibility}
          nameValue={formData.password}
          onChangeOfText={(text: string) => handleInputChange('password', text)}
        />

        {/* ////////////////////////confirm-password-container////////////////////// */}
        <PasswordInput
          placeholder="Enter confirm password"
          iconName="lock"
          secureText={confirmPasswordVisibility}
          toggleSecureText={toggleConfirmPasswordVisibility}
          nameValue={formData.confirmPassword}
          onChangeOfText={(text: string) =>
            handleInputChange('confirmPassword', text)
          }
        />
        <Text style={loginStyles.passwordText}>
          Password must contain 1 Uppercase,1 numeric,1 special characters and
          length greater than 7 characters{' '}
        </Text>
        <LoginButton buttonText="Next" buttonClick={() => OnButtonClick()} />
        <Loader visible={showLoader} />
      </View>
    </SafeAreaView>
  );
};
export default ForgotPasswordScreen;
