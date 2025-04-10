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
import {getTransactionHistory} from './ApiProvider';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import {FontAwesome} from '../../Components/ReactIcons/ReactIcon';
import {FilterModal} from '../Modals/FilterModel';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

export default function TransationHistoryScreen() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [transactionHistoryData, setTransactionHistoryData] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterModel, setFilterModel] = useState(false);

  // Fetch transaction history
  const getTransactionHistoryMethod = useCallback(
    async (FilterData: '') => {
      setTransactionHistoryData('');

      if (!authToken) {
        console.warn(
          'Auth token is missing, unable to fetch transaction history.',
        );
        return;
      }
      try {
        setIsLoading(true);
        const response = await getTransactionHistory(authToken, FilterData); // Pass filters here
        if (response?.data) {
          setTransactionHistoryData(response.data);
        } else {
          console.warn('Response data is empty or undefined.');
        }
      } catch (error: any) {
        console.log(
          'Error fetching transaction history:',
          error?.message || error,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [authToken],
  );

  useEffect(() => {
    if (authToken) {
      getTransactionHistoryMethod('');
    }
  }, [authToken]);

  const renderTransactionItem = ({item, index}: any) => {
    console.log('itemitem', item);
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
                item.transaction_type === 'Credit'
                  ? require('../../Assets/add_balance.png')
                  : item.transaction_type === 'Debit'
                  ? require('../../Assets/send_balance.png')
                  : require('../../Assets/wrong.png')
              }
              style={{height: 45, width: 45}}
            />
          </View>
          <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            {/* <Text style={styles.transactionDate}>{item.request_date}</Text> */}
            <Text style={styles.transactionDate}>{item.payment_actions}</Text>
            <Text style={[styles.transactionAmount]}>
              {item.transaction_id}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text
              style={[
                styles.transactionAmount,
                {
              fontSize: 18,
                  color: item.transaction_type === 'Credit' ? colors.green : colors.red,
                },
              ]}>
              {item.amount
                ? (item.transaction_type === 'Credit' ? '+' : '-') +
                  LOCALTEXT.CURRENCY_SYMBOL +
                  item.amount
                : 'N/A'}
            </Text>
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
              {item.transactions_date}
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
        title={'Transaction History'}
        filterIcon={true}
        onBackButton={() => navigation.goBack()}
        onfilterIconButton={() => {
          setFilterModel(true);
        }}
      />

      <FilterModal
        visible={isFilterModel}
        onRequestClose={() => setFilterModel(false)}
        applyFilters={(FilterData: any) => {
          setFilterModel(false);
          getTransactionHistoryMethod(FilterData);
        }}
        // select={() => selectImage()}
        cancel={() => setFilterModel(false)}
      />

      <View style={accountStyle.accountContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.scarletRed} />
          </View>
        ) : transactionHistoryData && transactionHistoryData.length > 0 ? (
          <FlatList
            data={transactionHistoryData}
            renderItem={renderTransactionItem}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                tintColor={colors.scarletRed} // Change the spinner color for iOS
                refreshing={isLoading} // Controls the loading spinner
                onRefresh={() => getTransactionHistoryMethod('')} // Triggered when user pulls to refresh
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
            <Text style={styles.noDataText}>No Transaction Found!</Text>
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
    borderRadius: 8,
 
    borderWidth: 0.5,
    borderColor: colors.titleColor,
  },
  transactionID: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
  },
  transactionDate: {
    fontSize: 12,
    color: '#777',
  },
  transactionInfo: {
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: '#888',
  },
  value: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
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
