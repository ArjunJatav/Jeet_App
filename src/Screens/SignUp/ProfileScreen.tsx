import React, {useState} from 'react';
import {Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import {styles} from './Styles';
import {
  EmailInput,
  NameInput,
  PasswordInput,
} from '../../Components/Input/ProfileInput';
import {SignUpButton} from '../../Components/Button/ProfileButton';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './navigation-types';
import {Loader} from '../../Components/Loader/Loader';
import {signUpApiCalling} from './ApiFunction';
import HeaderWithBackButton from '../../Components/Header/Header';
import { CricketBackground } from '../../Components/BackgroundImage/CricketBackround';
import { RouteProp } from '@react-navigation/native';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileScreen'
>;
type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'ProfileScreen'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}
export default function ProfileScreen({navigation,route}: ProfileScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: route.params.email,
    password: '',
    referralCode: '',
  });
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [showLoader, setshowLoader] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility); // Toggle visibility state
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value, // Update the specific field
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])(?=.{8,})/;

    if (!formData.name) return 'Please enter your name.';
    if (!formData.email) return 'Please enter your email.';
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email.';
    if (!formData.password) return 'Please enter your password.';
    if (!passwordRegex.test(formData.password))
      return 'Password must contain at least one uppercase letter, one number, one special character, and be 8+ characters long.';
    return null; // No validation errors
  };

  const OnRegister = () => {
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
    signUpApiCalling(
      formData,
      response => {
        setshowLoader(false);
        navigation.navigate('OtpVerification',{email:formData.email,fromScreen:"signup"});
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

  /////////////////////////////////////////////////sign-up-api-calling/////////////////////////////////////

  return (
 
      <SafeAreaView style={{ flex: 1}}>
    
    <View style={styles.container}>
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
      <HeaderWithBackButton title='Sign Up' onBackButton={()=>navigation.goBack()}/>
      <CricketBackground/>
      {/* ////////////////////////image-container////////////////////// */}
      {/* <View style={styles.imageContainer}>
        <Image
          source={{
           uri: imageBaseUrl+"fantasy-image/logo.jpg",
          }}
          style={styles.logoImage}
        />
      </View> */}
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled">
      {/* ////////////////////////fields-container////////////////////// */}
      <View style={styles.fieldsContainer}>
        {/* ////////////////////////name-container////////////////////// */}
        <NameInput
          placeholder="Enter your name"
          iconName="user-alt"
          nameValue={formData.name}
          onChangeOfText={(text: string) => handleInputChange('name', text)}
        />

        {/* ////////////////////////email-container////////////////////// */}
        <EmailInput
          placeholder="Enter your email"
          iconName="envelope"
          nameValue={formData.email}
          onChangeOfText={(text: string) => handleInputChange('email', text)}
        />

        {/* ////////////////////////password-container////////////////////// */}
        <PasswordInput
          placeholder="Enter password"
          iconName="lock"
          secureText={passwordVisibility}
          toggleSecureText={togglePasswordVisibility}
          nameValue={formData.password}
          onChangeOfText={(text: string) => handleInputChange('password', text)}
        />
        <Text style={styles.passwordText}>
          Password must contain 1 Uppercase,1 numeric,1 special characters and
          length greater than 7 characters{' '}
        </Text>
        {/* ////////////////////////referral-container////////////////////// */}
        <NameInput
          placeholder="Enter referral code (optional)"
          iconName="key"
          nameValue={formData.referralCode}
          onChangeOfText={(text: string) =>
            handleInputChange('referralCode', text)
          }
        />

        {/* ////////////////////////signup-button-container////////////////////// */}
        <View style={styles.buttonContainer}>
        <SignUpButton
          buttonText="Register"
          iconFrom="fontawesome"
          iconName="arrow-right"
          buttonClick={() => OnRegister()}
        />
        </View>
        
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Loader visible={showLoader} />
    </View>
    
    </SafeAreaView>
  
  );
}
