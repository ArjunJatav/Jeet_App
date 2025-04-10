import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import HomeHeader from '../../Components/Header/HomeHeader';
import {accountStyle} from './styles';
import GradientView from '../../Components/Gradents/Gradient';
import FastImage from 'react-native-fast-image';
import {colors} from '../../Components/Colors';
import {RootState} from '../../Redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserProfileDetails, updateProfilePhoto} from './ApiProvider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {setProfile} from '../../Redux/profileDataSlice';
import {Entypo} from '../../Components/ReactIcons/ReactIcon';
import {imageBaseUrl, imageDefaultUrl} from '../../ConstantFiles/Api';
import {ProfileParamList} from './navigation-types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import {SetProfileImageModal} from '../Modals/SetProfileImage';
// import ImageCropPicker from 'react-native-image-crop-picker';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import ImageCropPicker from 'react-native-image-crop-picker';

type NavigationProp = NativeStackNavigationProp<
  ProfileParamList,
  'AddBalanceScreen'
>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();

  const dispatch = useDispatch();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );
  const [profileImageModal, setProfileImageModal] = useState(false);
  const [profileImagePath, setProfileImagePath] = useState('');
  // console.log('ProfileData', reduceUserProfileData);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Converts the string to a Date object
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    }; // e.g., Jan 2025
    return date.toLocaleDateString('en-US', options); // Formats the date
  };


  const fetchData = async () => {
    try {
      const response = await fetchUserProfileDetails(authToken ?? '');
      dispatch(setProfile(response.data));
    } catch (err: any) {
      console.error(err.message || 'An error occurred'); // Fixing the error message fallback
    } finally {
      setLoading(false); // Hide loader when fetching is done
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [authToken]) // Add dependencies if needed
  );

  const captureImage = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        cropping: true, // Enables cropping
        cropperCircleOverlay: false, // Set to true for circular cropping
        compressImageQuality: 0.5, // Adjust quality
      });

      // Handle cropped image
      setProfileImagePath(image.path); // This will provide the cropped image path
      methodUpdateProfile(image.path);
      setProfileImageModal(false); // Call your custom method to update the profile
      console.log('Cropped Image Path:', image.path);
    } catch (error: any) {
      if (error.message.includes('cancelled')) {
        console.log('User cancelled image capture');
      } else {
        console.log('Error capturing and cropping image:', error.message);
      }
    }
  };

  const selectImage = () => {
    ImageCropPicker.openPicker({
      width: 300, // Desired cropped width
      height: 300, // Desired cropped height
      cropping: true, // Enable cropping
      compressImageQuality: 0.5, // Compress the image
    })
      .then(image => {
        if (image && image.path) {
          console.log('Cropped Image Path:', image.path);
          setProfileImagePath(image.path); // Set the cropped image path in state
          methodUpdateProfile(image.path);
          setProfileImageModal(false); // Call your custom method to update the profile
        } else {
          console.log('No image selected or cropped');
        }
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('User cancelled image picker');
        } else {
          console.error('ImagePicker Error:', error);
        }
      });
  };

  //   *** *** funcation for updateProfilePhoto ***  *** //
  const methodUpdateProfile = useCallback(
    async (imagePath: any) => {
      // console.log(imagePath);
      const uploaddata = new FormData();
      uploaddata.append('profile_image', {
        uri:
          Platform.OS === 'android'
            ? imagePath
            : imagePath.replace('file://', ''),
        type: 'image/jpeg', // Adjust as needed
        name: 'userImage.jpg', // File name
      });

      //*** *** method for calling updateProfilePhoto API ***  *** //
      try {
        const response = await updateProfilePhoto(uploaddata, authToken ?? '');

        console.log('responseresponse', response);

        if (response.status == true) {
          setAlertConfig({
            ...alertConfig,
            visible: true,
            type: 'success',
            title: 'Success!',
            message: response.message,
          });
        } else {
          setAlertConfig({
            ...alertConfig,
            visible: true,
            type: 'error',
            title: 'Error!',
            message: response,
          });
        }
      } catch (error: any) {
        console.error('Error occurred:', error.message || 'An error occurred');
      }
    },
    [authToken],
  );

  return (
    <SafeAreaView style={accountStyle.safeArea}>
      <View>
        <HomeHeader
          title="Bizz 11"
          onProfileClick={() => {
            //@ts-ignore
            navigation.openDrawer();
          }}
          onNotificationClick={() => {
            navigation.navigate('NotificationScreen');
          }}
          onWalletClick={() => {
            navigation.navigate('WalletWithdrawScreen');
          }}
        />

        <SetProfileImageModal
          visible={profileImageModal}
          onRequestClose={() => setProfileImageModal(false)}
          Camera={() => captureImage()}
          select={() => selectImage()}
          cancel={() => setProfileImageModal(false)}
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
            //@ts-ignore
            fetchData();
            setAlertConfig(prev => ({...prev, visible: false})); // Corrected semicolon
          }}
          onCancel={() => setAlertConfig(prev => ({...prev, visible: false}))}
        />

        <View style={accountStyle.accountContainer}>
          <View style={[accountStyle.playerInfo, {height: 110}]}>
            <View>
              <FastImage
                source={{
                  uri:
                    imageBaseUrl + reduceUserProfileData?.profile_image ||
                    imageDefaultUrl,
                }}
                style={accountStyle.playerImage}
              />
              {/* Edit Icon */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  borderWidth: 1,
                  borderColor: colors.scarletRed,
                  bottom: 5, // Adjust based on the desired position
                  right: -5, // Adjust based on the desired position
                  backgroundColor: colors.white, // Background color for visibility
                  borderRadius: 20, // Circular shape
                  padding: 8, // Padding for touchable area
                }}
                onPress={() => setProfileImageModal(true)} // Replace with your function
              >
                <Entypo
                  name="camera"
                  size={15}
                  color={colors.scarletRed}
                  style={{height: 15, width: 15}}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                accountStyle.playerName,
                {color: colors.black, marginTop: 10},
              ]}>
              {reduceUserProfileData?.name}
            </Text>
          </View>

          <GradientView
            colors={[colors.scarletRed, colors.scarletRed]}
            start={{x: 0.2, y: 1}}
            end={{x: 1, y: 0.2}}
            style={accountStyle.matchCard}>
            <View style={accountStyle.matchCardContent}>
              <Text
                style={[
                  accountStyle.playerName,
                  {fontSize: 18, textAlign: 'center'},
                ]}>
                PLAYING HISTORY
              </Text>

              <TouchableOpacity
                style={accountStyle.playerRow}
                activeOpacity={1.0}
                onPress={() => navigation.navigate('AllCompleteMatch')} >
                <View style={accountStyle.playerBox}>
                  <Text style={accountStyle.statsText}>
                    {reduceUserProfileData?.contest}
                  </Text>
                  <Text style={accountStyle.statsLabel}>CONTEST</Text>
                </View>
                <View style={accountStyle.playerBox}>
                  <Text style={accountStyle.statsText}>
                    {reduceUserProfileData?.matches}
                  </Text>
                  <Text style={accountStyle.statsLabel}>MATCH</Text>
                </View>
              </TouchableOpacity>
            </View>
          </GradientView>
          <View style={accountStyle.container}>
            <View style={accountStyle.section}>
              <Text style={accountStyle.sectionText}>
                {/* {'You Have Been Playing on FantasyApp Since Jan 2025'} */}
                {'You Have Been Playing on FantasyApp Since ' +
                  formatDate(reduceUserProfileData?.created_at)}
              </Text>
            </View>

            <View style={accountStyle.walletContainer}>
              <TouchableOpacity
                style={accountStyle.walletHeader}
                onPress={() => {
                  navigation.navigate('WalletWithdrawScreen');
                }}
                activeOpacity={0.9}>
                <Text style={accountStyle.walletHeaderText}>{'Wallet'}</Text>
                <Entypo
                  name="chevron-right"
                  size={20}
                  color={colors.scarletRed}
                  style={accountStyle.icon}
                />
              </TouchableOpacity>
              <View style={accountStyle.containerddd}>
                {/* Tab 1 */}
                <View style={accountStyle.tabContainer}>
                  <Text style={accountStyle.amountText}>
                    {LOCALTEXT.CURRENCY_SYMBOL}
                    {reduceUserProfileData?.current_balance}
                  </Text>
                  <Text style={accountStyle.labelText}>Deposited</Text>
                </View>

                {/* Tab 2 */}
                <View style={accountStyle.tabContainer}>
                  <Text style={accountStyle.amountText}>
                    {LOCALTEXT.CURRENCY_SYMBOL}
                    {reduceUserProfileData?.winning_amount}
                  </Text>
                  <Text style={accountStyle.labelText}>Winning</Text>
                </View>

                {/* Tab 3 */}
                <View style={accountStyle.tabContainer}>
                  <Text style={accountStyle.amountText}>
                    {LOCALTEXT.CURRENCY_SYMBOL}
                    {reduceUserProfileData?.bonus_amount}
                  </Text>
                  <Text style={accountStyle.labelText}>Bonus</Text>
                </View>

                {/* Add Balance Button */}
                <TouchableOpacity
                  style={accountStyle.addBalanceContainer}
                  onPress={() => {
                    navigation.navigate('AddBalanceScreen');
                  }}>
                  <Text style={accountStyle.addBalanceText}>Add Balance</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
