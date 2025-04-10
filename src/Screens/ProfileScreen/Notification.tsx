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
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';
import {getNotification} from './ApiProvider';
import {FontAwesome} from '../../Components/ReactIcons/ReactIcon';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

export default function NotificationScreen() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [notificationData, setNotificationData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getNotificationMethod = useCallback(async () => {
    if (!authToken) {
      console.warn('Auth token is missing, unable to fetch notifications.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await getNotification(authToken);
      if (response?.data) {
        setNotificationData(response.data);
      } else {
        console.warn('Response data is empty or undefined.');
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error?.message || error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      getNotificationMethod();
    }
  }, [authToken]);

  const renderNotificationItem = ({item, index}: any) => {
    return (
      <View
        style={[
          styles.notificationCard,
          index === 0 && {marginTop: 16},
          item.is_read === 0 && {backgroundColor: colors.lightGray}, // Highlight unread notifications
        ]}>
        <Text style={[styles.notificationTitle,{color:colors.scarletRed}]}>{item.title || 'N/A'}</Text>
        <Text style={styles.notificationBody}>{item.body || 'N/A'}</Text>
       
        <View style={styles.notificationFooter}>
          <Text style={styles.statusText}>
            {item.is_read === 1 ? (
              <FontAwesome
                name="check-circle"
                size={18}
                color={colors.lightBlue}
              />
            ) : (
              <FontAwesome
                name="exclamation-circle"
                size={18}
                color={colors.orange}
              />
            )}
            {item.is_read === 1 ? ' Read' : ' Unread'}
          </Text>
          <Text style={styles.notificationDate}>
          {item.start_date_time || 'N/A'}
        </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Notifications"
        onBackButton={() => navigation.goBack()}
      />

      <View style={accountStyle.accountContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.lightBlue} />
          </View>
        ) : notificationData && notificationData.length > 0 ? (
          <FlatList
            data={notificationData}
            renderItem={renderNotificationItem}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                tintColor={colors.lightBlue} // Change the spinner color for iOS
                refreshing={isLoading} // Controls the loading spinner
                onRefresh={() => getNotificationMethod()} // Triggered when user pulls to refresh
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
            <Text style={styles.noDataText}>No Notifications Found!</Text>
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
  notificationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowRadius: 4, // Reduced shadow radius
    elevation: 1, // Reduced elevation for softer shadow
    borderWidth: 1,
    borderColor: '#ddd',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.scarletRed,
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#555',
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
