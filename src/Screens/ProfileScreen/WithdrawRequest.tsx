import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';
import {
  cancelWithdrawAmountMethod,
  getWithdrawRequestHistory,
} from './ApiProvider';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import {FontAwesome} from '../../Components/ReactIcons/ReactIcon';
import {CustomAlert} from '../../Components/Alert/CustomAlert';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

export default function WithdrawRequestScreen() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [withdrawRequestHistoryData, setWithdrawRequestHistoryData] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  // Fetch transaction history
  const withdrawRequestHistoryMethod = useCallback(async () => {
    if (!authToken) return;
    try {
      setIsLoading(true);
      const response = await getWithdrawRequestHistory(authToken);
      if (response?.data && JSON.stringify(response.data) !== JSON.stringify(withdrawRequestHistoryData)) {
        setWithdrawRequestHistoryData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching withdraw history:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, withdrawRequestHistoryData]);

  useEffect(() => {
    withdrawRequestHistoryMethod();
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      withdrawRequestHistoryMethod();
    }
  }, [authToken]);

  //   *** *** funcation for AddBalance ***  *** //
  const methodCalcelWithdrawRequest = useCallback(
    async (cancelRequestData: any) => {
      let cancelData = {
        status: 'Canceled',
        id: cancelRequestData.id,
      };

      console.log('cancelRequestData', cancelData);

      // *** *** method for calling AddAmount API ***  *** //
      try {
        const response = await cancelWithdrawAmountMethod(
          cancelData,
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
    },
    [authToken],
  );

  const renderWithdrawItem = ({item, index}: any) => {
    return (
      <View style={[styles.transactionItem, index === 0 && {marginTop: 16}]}>
        <View style={styles.transactionDetails}>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.newGray,
              marginRight: 10,
              borderRadius: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                item.status === 'Pending'
                  ? require('../../Assets/pending.png')
                  : item.status === 'Approved'
                  ? require('../../Assets/success.png')
                  : require('../../Assets/wrong.png')
              }
              style={{height: 45, width: 45}}
            />
          </View>
          <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            {/* <Text style={styles.transactionDate}>{item.request_date}</Text> */}
            <Text style={styles.transactionDate}>{'Payment Status'}</Text>
            <Text style={styles.transactionAmount}>{item.status}</Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            {item.status === 'Pending' ? (
              <TouchableOpacity
                onPress={() => {
                  methodCalcelWithdrawRequest(item);
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{'Cancel Request'}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.transactionDate}>{'Amount'}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        item.status === 'Approved' ? colors.green : colors.red,
                    },
                  ]}>
                  {item.amount
                    ? (item.status === 'Approved' ? '+' : '') +
                      LOCALTEXT.CURRENCY_SYMBOL +
                      item.amount
                    : 'N/A'}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.transactionDetails}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            {/* <Text style={styles.transactionDate}>{item.request_date}</Text> */}
            <Text style={styles.transactionDate}>{'Date: '}</Text>
            <Text
              style={[
                styles.transactionDate,
                {color: colors.black, fontWeight: '400'},
              ]}>
              {item.request_date}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
            {/* <Text style={styles.transactionDate}>{item.request_date}</Text> */}
            <Text style={styles.transactionDate}>{'Payment Method: '}</Text>
            <Text
              style={[
                styles.transactionDate,
                {color: colors.black, fontWeight: '400'},
              ]}>
              {'Upi'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Withdraw History"
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
          withdrawRequestHistoryMethod();
          setAlertConfig(prev => ({...prev, visible: false})); // Corrected semicolon
        }}
        onCancel={() => setAlertConfig(prev => ({...prev, visible: false}))}
      />
      <View style={accountStyle.accountContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.lightBlue} />
          </View>
        ) : withdrawRequestHistoryData &&
          withdrawRequestHistoryData.length > 0 ? (
          <FlatList
            data={withdrawRequestHistoryData}
            renderItem={renderWithdrawItem}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                tintColor={colors.lightBlue} // Change the spinner color for iOS
                refreshing={isLoading} // Controls the loading spinner
                onRefresh={() => withdrawRequestHistoryMethod()} // Triggered when user pulls to refresh
              />
            }
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Image
              source={require('../../Assets/No_Data_found.png')}
              style={{height: windowWidth / 2, width: windowWidth / 2}}
              resizeMode="cover"
            />
            <Text style={styles.noDataText}>No Withdraw History Found!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  accountContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 250,
  },
  transactionItem: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 5,

    borderWidth: 2,
    borderColor: colors.newGray,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height:50,
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.titleColor,
    marginBottom: 2,
    fontWeight: '300',
  },
  statusText: {
    fontSize: 15,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: '600',
    padding: 5,
  },
  noDataContainer: {
    height: windowHeight - 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.lightBlue,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
