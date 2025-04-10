import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
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
import {withdrawAmountMethod} from './ApiProvider';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import GradientView from '../../Components/Gradents/Gradient';
import BottomButton from '../../Components/Button/BottomButton';

let windowWidth = Dimensions.get('window').width;

export default function WalletWithdrawScreen() {
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

  const currentBalance = reduceUserProfileData?.current_balance ?? 0;
  const isBalanceSufficient = parseFloat(amountValue) <= currentBalance;
  //   *** *** funcation for AddBalance ***  *** //
  const methodWithdrawAmount = useCallback(async () => {
    let addAmonutData = {
      amount: amountValue,
    };

    // console.log("addAmonutDataaddAmonutDataaddAmonutData",addAmonutData);

    // *** *** method for calling AddAmount API ***  *** //
    try {
      const response = await withdrawAmountMethod(
        addAmonutData,
        authToken ?? '',
      );

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
        title="Withdraw Amount"
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
            <View style={{marginTop: 10}}>
              <View
                //colors={[colors.scarletRed]}
                // start={{x: 0.2, y: 1}}
                // end={{x: 1, y: 0.2}}
                style={[
                  accountStyle.matchCard,
                  {marginBottom: 20, height: 100,backgroundColor:colors.scarletRed},
                ]}>
                <View style={accountStyle.matchCardContent}>
                  <Text style={{fontSize: 25}}>
                    <Text
                      style={[accountStyle.playerName, {color: colors.white}]}>
                      Withdrawal Amount:-
                    </Text>
                    <Text
                      style={[accountStyle.playerName, {color: colors.white}]}>
                      {' ' +
                        LOCALTEXT.CURRENCY_SYMBOL +
                        reduceUserProfileData?.current_balance}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      accountStyle.playerName,
                      {
                        fontSize: 16,
                        color: isBalanceSufficient ? colors.white : colors.red,
                      },
                    ]}>
                    {isBalanceSufficient
                      ? "You're eligible to request a withdrawal!"
                      : "You don't have sufficient balance to request a withdrawal."}
                  </Text>
                </View>
              </View>
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
                    backgroundColor:colors.white,
                    borderWidth:2,
                    borderColor:colors.newGray,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      height: 45,
                      //   paddingHorizontal: 10,
                    }}>
                    <Text style={{fontSize: 12, color:colors.black}}>Enter Amount</Text>
                    <TextInput
                      style={{fontSize: 14, fontWeight: '600',color:colors.black}}
                      value={amountValue}
                      maxLength={10}
                      onChangeText={text => {
                        // Allow only numeric values
                        if (/^\d*$/.test(text)) {
                          setamountValue(text);
                        }
                      }}
                      // Update value as user types
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
                    backgroundColor:colors.white,
                    borderWidth:2,
                    borderColor:colors.scarletRed,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 18, fontWeight: '600', color:colors.scarletRed}}>
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
                    backgroundColor:colors.white,
                    borderWidth:2,
                    borderColor:colors.scarletRed,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 18, fontWeight: '600',color:colors.scarletRed}}>
                    {LOCALTEXT.CURRENCY_SYMBOL + '500'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 50,
                  borderRadius: 5,
                  backgroundColor:colors.white,
                  paddingHorizontal: 10,
                  marginHorizontal: 10,
                  marginTop: 10,
                  borderWidth:2,
                    borderColor:colors.newGray,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 15, fontWeight: '500',color:colors.black}}>
                  Amount to Withdraw
                </Text>

                <Text style={{fontSize: 18, fontWeight: '600',color:colors.scarletRed}}>
                  {LOCALTEXT.CURRENCY_SYMBOL}
                  {amountValue}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {isBalanceSufficient && amountValue > '0' && (
         <BottomButton
         title="Withdraw"
         onPress={() =>{
          methodWithdrawAmount();
         }
         }
       />

      )}
    </SafeAreaView>
  );
}
