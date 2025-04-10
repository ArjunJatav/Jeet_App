import React, {useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {colors} from '../../Components/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {imageBaseUrl, imageDefaultUrl} from '../../ConstantFiles/Api';
import GradientView from '../../Components/Gradents/Gradient';
import {LogOut} from './ApiProvider';
import {useNavigation} from '@react-navigation/native';
import {clearToken, setToken} from '../../Redux/authReducer';
import AsyncStorageWrapper from '../../Components/AsyncStorage/AsyncStorageValue';
const ProfileSlideDrawer = (props: any) => {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data ?? {},
  );
  const dispatch = useDispatch();
  //   *** *** function for LogOutApi ***  *** //
  const methodLogOutUser = useCallback(() => {
    // Show confirmation alert
    Alert.alert(
      'Logout Confirmation', // Title of the alert
      'Are you sure you want to log out?', // Message in the alert
      [
        {
          text: 'Cancel', // Button to cancel
          style: 'cancel',
          onPress: () => {
            console.log('Logout cancelled');
          },
        },
        {
          text: 'Yes, Log Out', // Button to confirm logout
          onPress: async () => {
            try {
              // Call the logout API
              const response = await LogOut(authToken ?? '');
              console.log('Logged out successfully:', response);

              // Clear Redux state
              dispatch(setToken(''));
              dispatch(clearToken());

              // Clear async storage
              await AsyncStorageWrapper.setItem('USER_LOGIN_SESSION', '');
              await AsyncStorageWrapper.setItem('USER_AUTH_TOKEN', '');

              // Close the drawer if open
              props.navigation.closeDrawer();

              // Reset the navigation stack and navigate to login
              navigation.reset({
                index: 0, //@ts-ignore
                routes: [{name: 'LoginRoute'}],
              });
            } catch (error: any) {
              console.error(
                'Error occurred:',
                error.message || 'An error occurred',
              );
            }
          },
        },
      ],
      {cancelable: false}, // Prevent dismissal by tapping outside
    );
  }, [authToken, props.navigation, navigation, dispatch]);

  return (
    <View style={styles.drawerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              imageBaseUrl + reduceUserProfileData.profile_image ||
              imageDefaultUrl,
          }} // Replace with dynamic profile picture
          style={styles.profileImage}
        />

        <Text style={styles.username}>{reduceUserProfileData.name}</Text>
        <Text style={styles.email}>{reduceUserProfileData.email}</Text>
      </View>
      <GradientView
        colors={[colors.scarletRed, colors.scarletRed]}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 0.1}}>
        <View style={[styles.navItem, {justifyContent: 'space-between'}]}>
          <Text style={[styles.navItemText, {color: colors.white}]}>
            Total Balance
          </Text>
          <Text
            style={[
              styles.navItemText,
              {color: colors.white, marginRight: 10},
            ]}>
            ${reduceUserProfileData?.current_balance}
          </Text>
        </View>
      </GradientView>

      {/* Navigation Links */}

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          props.navigation.closeDrawer(); // Close the drawer after navigation
          props.navigation.navigate('InviteFriendsScreen');
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/refer_and_earn.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Refer & Earn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          props.navigation.closeDrawer(); // Close the drawer after navigation
          props.navigation.navigate('WithdrawRequestScreen');
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/withdraw_request.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Withdraw Request</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          props.navigation.closeDrawer(); // Close the drawer after navigation
          props.navigation.navigate('TransationHistoryScreen');
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/transition_history.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Transaction History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          props.navigation.navigate('TermsandConditonScreen');

          props.navigation.closeDrawer();
          // termsandConditonMethos()
          //props.navigation.closeDrawer(); // Close the drawer after navigation
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/terms_and_condition.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Terms & Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          props.navigation.navigate('UserFeedbackScreen');
          props.navigation.closeDrawer(); // Close the drawer after navigation
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/contact_us.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Contact Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem]}
        onPress={() => {
          methodLogOutUser(); // Navigate to settings screen
        }}>
        <Image
          // source={{
          //   uri: imageBaseUrl+"fantasy-image/logo.jpg",
          // }}
          source={require('../../Assets/logout.png')}
          style={{
            height: 20,
            width: 20,
            tintColor: colors.titleColor,
            marginRight: 5,
          }}
        />
        <Text style={styles.navItemText}>Log Out</Text>
      </TouchableOpacity>

      <View
        style={[
          styles.navItem,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 10,
            width: '100%',
          },
        ]}>
        <Text
          style={[
            styles.navItemText,
            {color: colors.scarletRed, fontWeight: '500'},
          ]}>
          Version 1.0
        </Text>
      </View>

      {/* Add more items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#ECF2FF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 50,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color:colors.black
  },
  email: {
    fontSize: 14,
    color: colors.titleColor,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  navItemText: {
    fontSize: 16,
    color: colors.titleColor,
    fontWeight: '500',
  },
});

export default ProfileSlideDrawer;
