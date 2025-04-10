import {
  Dimensions,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import Share from 'react-native-share';
import {colors} from '../../Components/Colors';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  MaterialIcons,
} from '../../Components/ReactIcons/ReactIcon';
import { homeStyle } from '../HomeScreen/styles';
import { LoginButton } from '../../Components/Button/LoginButton';
import BottomButton from '../../Components/Button/BottomButton';

export default function InviteFriendsScreen() {
  const navigation = useNavigation();
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );

    const handleInviteFriend = () => {
      const shareOptions = {
        title: 'Invite Your Friend',
        message: 'Hey! Check out this amazing app: [Your App Name]. Download it here: [Your App Link]',
        url: 'https://example.com', // Replace with your app's URL
      };
  
      Share.open(shareOptions)
        .then((res) => {
          console.log('Share success:', res);
        })
        .catch((err) => {
          if (err && err.message) {
            console.error('Share error:', err.message);
          }
        });
    };


    const handleCopyReferralCode = () => {
      const referralCode = reduceUserProfileData?.referral_code?.toUpperCase();
      if (referralCode) {
        Clipboard.setString(referralCode);
    
        if (Platform.OS === 'android') {
          // Show toast on Android
          ToastAndroid.show('Referral code copied!', ToastAndroid.SHORT);
        } else {
          // Show alert on iOS
          Alert.alert('Copied!', 'Referral code copied to clipboard.');
        }
      } else {
        Alert.alert('Error', 'No referral code found.');
      }
    };
  

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Invite Friends"
        onBackButton={() => navigation.goBack()}
      />

      <View style={accountStyle.accountContainer}>
        <View
          style={{
            // height: windowHeight / 2,
            backgroundColor: colors.scarletRed,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 30,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            Refer your Friends
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            and Earn
          </Text>
        
          <Image
            source={require('../../Assets/gift_image.png')}
            style={{height: 80, width: 80, marginTop: 10}}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 20,
              color: colors.white,
              fontWeight: '400',
              textAlign: 'center',
              marginTop:10,
            }}>
            Refer friend to us,
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: colors.white,
              fontWeight: '400',
              textAlign: 'center',
            }}>
            and you and your friend will get $50
          </Text>
          <View
            style={{
              marginTop: 25,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: colors.white,
              borderStyle: 'dashed',
              flexDirection: 'row',
              padding: 5,
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.white,
                  fontWeight: '400',
                  textAlign: 'center',
                }}>
                {reduceUserProfileData?.referral_code.toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                width: 2,
                backgroundColor: colors.lightBlue,
                marginHorizontal: 8,
              }}></View>
            <TouchableOpacity
             onPress={handleCopyReferralCode}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons
                name="copy-all"
                size={30}
                color={colors.white}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomButton
        title="Invite Your friend"
        onPress={() =>{
          handleInviteFriend();
        }
        }
      />
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    // padding: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: colors.orange,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
