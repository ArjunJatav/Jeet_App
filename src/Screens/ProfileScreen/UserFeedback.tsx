import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';
import {LoginButton} from '../../Components/Button/LoginButton';
import {homeStyle} from '../HomeScreen/styles';
import {submitFeedback} from './ApiProvider';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import BottomButton from '../../Components/Button/BottomButton';

export default function UserFeedbackScreen() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);

  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );

  //   *** *** funcation for handleSubmitFeedback ***  *** //
  const handleSubmitFeedback = useCallback(async () => {
    let feedbackData = {
      content: feedback,
    };

    // *** *** method for calling submitFeedback API ***  *** //
    try {
      const response = await submitFeedback(feedbackData, authToken ?? '');

      // console.log('Amount Added succeed', response);
      setAlertConfig({
        ...alertConfig,
        visible: true,
        type: 'success',
        title: 'Success!',
        message: response.message,
      });
    } catch (error: any) {
      setAlertConfig({
        ...alertConfig,
        visible: true,
        type: 'error',
        title: 'Error!',
        message: error.message,
      });
    }
  }, [authToken, feedback]);

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Feedback"
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
        onConfirm={() => {
          setAlertConfig(prev => ({...prev, visible: false})); // Corrected semicolon
          //@ts-ignore
          navigation.push('BottomTab', {screen: 'AccountRoute'});
        }}
        onCancel={() => setAlertConfig(prev => ({...prev, visible: false}))}
      />
       <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={accountStyle.accountContainer}>
        <View style={styles.contentContainer}>
        <Text style={styles.emailLabel}>Feedback Form</Text>
          <Text style={styles.termsText}>
            Please provide your feedback. Let us know how we can improve.
          </Text>

          {/* Non-Editable Email Box */}
          <Text style={styles.emailLabel}>Name</Text>
          <View style={styles.emailBoxContainer}>
            {/* <Text style={styles.emailLabel}>Your Email</Text> */}
            <Text style={styles.emailBox}>
              {reduceUserProfileData?.name || 'No name provided'}
            </Text>
          </View>
          <Text style={styles.emailLabel}>Email</Text>
          <View style={styles.emailBoxContainer}>
            {/* <Text style={styles.emailLabel}>Your Email</Text> */}
            <Text style={styles.emailBox}>
              {reduceUserProfileData?.email || 'No email provided'}
            </Text>
          </View>
          <Text style={styles.emailLabel}>Message</Text>
          <TextInput
            style={styles.feedbackInput}
            multiline
            numberOfLines={6}
            placeholder="Enter your feedback here..."
            value={feedback}
            onChangeText={setFeedback}
            placeholderTextColor={colors.modalOpacity}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
      {feedback && (
         <BottomButton
         title="Submit Feedback"
         onPress={() =>{
          handleSubmitFeedback();
         }
         }
       />
        
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.modalOpacity,
    marginBottom: 10,
  },
  emailBoxContainer: {
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.newGray,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight:"600",
    color: colors.black,
    marginBottom: 5,
  },
  emailBox: {
    fontSize: 16,
    color: '#333',
  },
  feedbackInput: {
    height: 150,
    borderColor: colors.newGray,
    backgroundColor:colors.white,
    borderWidth: 2,
    borderRadius: 2,
    padding: 10,
    color: colors.black,
    fontSize: 16,

    textAlignVertical: 'top', // Ensures text starts from the top of the TextInput
  },
  errorText: {
    fontSize: 16,
    color: colors.orange,
    textAlign: 'center',
    marginTop: 10,
  },
  submitContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
