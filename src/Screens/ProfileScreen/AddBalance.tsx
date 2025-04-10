import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';
import {Entypo} from '../../Components/ReactIcons/ReactIcon';
import {LoginButton} from '../../Components/Button/LoginButton';
import {homeStyle} from '../HomeScreen/styles';
import {addAmountMethod} from './ApiProvider';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import BottomButton from '../../Components/Button/BottomButton';

let windowWidth = Dimensions.get('window').width;

export default function AddBalanceScreen() {
  const navigation = useNavigation();
  const [isCrossedIconShow, setIsCrossedIconShow] = useState(false); // Prevent multiple API calls
  const [amountValue, setamountValue] = useState('0'); // Prevent multiple API calls

  const authToken = useSelector((state: RootState) => state.auth.token);
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });
  // console.log('ProfileData', reduceUserProfileData);
  const generateTransactionId = () => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `txn_${timestamp}_${randomNum}`;
  };
  //   *** *** funcation for AddBalance ***  *** //
  const methodAddBalance = useCallback(async () => {
    let addAmonutData = {
      amount: amountValue,
      transaction_id: generateTransactionId(),
      payment_method: 'upi',
      transaction_status: 'Completed',
      payment_data: '',
    };

    // console.log("addAmonutDataaddAmonutDataaddAmonutData",addAmonutData);

    // *** *** method for calling AddAmount API ***  *** //
    try {
      const response = await addAmountMethod(addAmonutData, authToken ?? '');

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
      // console.error('Error occurred:', error.message || 'An error occurred');
    }
  }, [authToken, amountValue]);

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Add Balance"
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
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={accountStyle.accountContainer}>
            <View style={{marginTop: 20}}>
              <View
                style={{
                  height: 45,
                  flexDirection: 'row',
                  gap: 5,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor: colors.newGray,
                    backgroundColor: colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      // backgroundColor:"red",
                      height: 45,
                      // justifyContent:"center"
                      //   paddingHorizontal: 10,
                    }}>
                    <Text style={{fontSize: 12, color: colors.black}}>
                      Enter Amount
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.black,
                      }}
                      value={amountValue}
                      maxLength={10}
                      onChangeText={text => {
                        // Allow only numeric values
                        if (/^\d*$/.test(text)) {
                          setamountValue(text);
                        }
                      }} // Update value as user types
                      keyboardType="numeric" // Optional, to allow only numbers
                    />
                    {/* <Text style={{fontSize: 14,fontWeight: '600'}}>{amountValue}</Text> */}
                  </View>
                  {!isCrossedIconShow && (
                    <Entypo
                      name={'circle-with-cross'}
                      onPress={() => {
                        setIsCrossedIconShow(true);
                        setamountValue('0');
                      }}
                      size={20}
                      color={colors.black}
                      style={{height: 20, width: 20}}
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setamountValue('100');
                  }}
                  style={{
                    flex: 0.5,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.scarletRed,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: colors.scarletRed,
                    }}>
                    {LOCALTEXT.CURRENCY_SYMBOL + '100'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setamountValue('500');
                  }}
                  style={{
                    flex: 0.5,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: colors.scarletRed,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: colors.scarletRed,
                    }}>
                    {LOCALTEXT.CURRENCY_SYMBOL + '500'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 50,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  marginHorizontal: 10,
                  marginTop: 10,
                  borderWidth: 2,
                  borderColor: colors.newGray,
                  backgroundColor: colors.white,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: colors.black,
                  }}>
                  Amount to Current Balance
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.scarletRed,
                  }}>
                  {LOCALTEXT.CURRENCY_SYMBOL}
                  {amountValue}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {amountValue > '0' && (
        <BottomButton
          title="Add Amount"
          onPress={() => {
            methodAddBalance();
          }}
        />
      )}
    </SafeAreaView>
  );
}
