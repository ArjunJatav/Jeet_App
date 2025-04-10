import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../Components/Colors';
import {homeStyle} from './styles';
import FastImage from 'react-native-fast-image';
import {HomeParamList} from './navigation-types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AntDesign,
  EvilIcons,
  Octicons,
} from '../../Components/ReactIcons/ReactIcon';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {createTeamApi, joinContest} from './HomeApiProvider';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import BottomButton from '../../Components/Button/BottomButton';

let windowWidth = Dimensions.get('window').width;
type TeamPreviewScreenNavigationProp = NativeStackNavigationProp<
  HomeParamList,
  'TeamPreviewScreen',
  'HomeScreen'
>;
export default function SelectCaptainScreen(route: any) {
  const navigation = useNavigation<TeamPreviewScreenNavigationProp>();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const defaultImage = `${imageBaseUrl}users/default-user.jpg`; // External URL

  const reduceUserProfileData =
    useSelector((state: RootState) => state.profile.data) || {};
  // console.log('ProfileData', reduceUserProfileData.id);

  const [selectedCaptain, setSelectedCaptain] = useState<{
    name: string;
    image: string;
    role: string;
  } | null>(null);
  const [selectedViceCaptain, setSelectedViceCaptain] = useState<{
    name: string;
    image: string;
    role: string;
  } | null>(null);

  const paramsData = route?.route?.params?.params || []; // Default to an empty array if paramsData is undefined
  const fromButton = route?.route?.params?.fromButton || []; // Default to an empty array if paramsData is undefined
  const paramsTeamData = route?.route?.params?.paramsData || []; // Default to an empty array if paramsData is undefined
 


  const title =  'Select Players';

  // Create an array to store the captain and vice-captain titles
  const playerWithTitles = paramsData.map((player: any) => ({
    ...player,
    is_captain: player === selectedCaptain,
    is_vice_captain: player === selectedViceCaptain,
    user_id: Number(reduceUserProfileData.id), // Convert the user ID to a number and append it
  }));

  

  const createTeamApiCalling = useCallback(() => {
      // Define the playerData object correctly
  const playerData = {
    "series_id": paramsTeamData.series_id,
    "cricbuzz_series_id": paramsTeamData.cricbuzz_series_id,
    "matches_id": paramsTeamData.id,
    "cricbuzz_match_id": paramsTeamData.cricbuzz_match_id,
    "team_data": playerWithTitles,
  };
    createTeamApi(
      playerData, // Ensure 'data' is defined in your component
      response => {
        // console.log('Team created successfully:', response.message);
        if (fromButton == "joinContest") {
          methodJoinContest(response.data)
        }else{
          Alert.alert(
            'Done', // Title of the alert
            'Team Created Successfully.', // Message of the alert
            [
              {
                text: 'OK', // Text for the button
                onPress: () =>
                  //@ts-expect-error
                  navigation.push('BottomTab', {screen: 'HomeRoute'}), // Action when the button is pressed
              },
            ],
            {cancelable: false}, // Prevent the alert from being dismissed by tapping outside
          );
        }
        
      },
      error => {
        console.error('Error occurred:', error.message || 'An error occurred');
      },
      statusError => {
        console.warn('Status Error:', statusError.message || 'Status is false');
      },
      authToken ?? '', // Pass authToken
    );
  }, [authToken, playerWithTitles,paramsTeamData]);


    //   *** *** funcation for joinContest ***  *** //
    const methodJoinContest = useCallback(
      async (joinIteams: any) => {
        let contestJoinData = {
          user_id: joinIteams?.user_id,
          contest_id: paramsTeamData.id,
          matches_id: paramsTeamData.cricbuzz_match_id,
          series_id: paramsTeamData?.series_id,
          user_team_id: joinIteams?.id,
          payment_method: 'upi', 
          amount: paramsTeamData?.entryFees,
          transaction_status: 'Completed',
        };
  
        // *** *** method for calling Joincontest API ***  *** //
        try {
          const response = await joinContest(contestJoinData, authToken ?? '');
  
          // console.log('Team created successfully:', response);
  
          Alert.alert(
            'Success',
            'Your team has been successfully created and joined the contest.',
            [
              {
                text: 'OK',
                onPress: () => {
                  //@ts-expect-error
                  navigation.push('BottomTab', {screen: 'HomeRoute'});
                },
              },
            ],
            {cancelable: false},
          );
        } catch (error: any) {
          console.error('Error occurred:', error.message || 'An error occurred');
        }
      },
      [authToken, navigation],
    );

  const renderPlayerList = (players: any) => {
    // Define the desired role order
    const roleOrder = [
      'WK-Batsman',
      'Batsman',
      'Batting Allrounder',
      'Bowling Allrounder',
      'Bowler',
    ];

    // Group players by roles and sort within groups
    const groupedPlayers = roleOrder.map(role => ({
      role,
      players: players.filter((player: any) => player.role === role),
    }));

    const handleSelectCaptain = (player: any) => {
      if (selectedViceCaptain === player) {
        setSelectedViceCaptain(null); // Deselect as VC if selected as Captain
      }
      setSelectedCaptain(player === selectedCaptain ? null : player);
    };

    const handleSelectViceCaptain = (player: any) => {
      if (selectedCaptain === player) {
        setSelectedCaptain(null); // Deselect as Captain if selected as VC
      }
      setSelectedViceCaptain(player === selectedViceCaptain ? null : player);
    };
    const renderSection = (title: any, playerList: any) => (
      <>
        {/* Section Title */}
        {/* <View
          style={{
            height: 10,
            backgroundColor: '#ECF2FF',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View> */}

        {playerList.map((player: any, index: any) => {
          const playerKey = `${player.name}-${player.country}`;
          const isLastPlayer = index === playerList.length - 1;
          const isCaptain = selectedCaptain === player;
          const isViceCaptain = selectedViceCaptain === player;

          return (
            <View
              style={{
                height: 70,
                borderBottomWidth: 0.5,
                borderColor: colors.lightGray,
                backgroundColor: 'white', // Replace with `colors.white` if needed
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: 70,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <FastImage
                  source={{
                    uri: `${imageBaseUrl + player.image}` || defaultImage,
                  }}
                  style={{width: 50, height: 50, borderRadius: 25}}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  // height: 80,
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <Text style={[homeStyle.captainPointsText, {fontSize: 15, color:colors.black}]}>
                  {player.name.includes(' ') // Check if the name contains a space
                    ? player.name
                        .split(' ')
                        .map((part: any, index: any) =>
                          index === 0 ? `${part[0]}.` : part,
                        )
                        .join(' ') // Shorten first name, leave last name as is
                    : player.name}
                </Text>
                {/* <Text style={[homeStyle.footerText, {fontSize: 14}]}>
                  {player.points  + ' pts'}
                </Text> */}
              </View>
              <View
                style={{
                  // height: 80,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <TouchableOpacity
                  onPress={() => handleSelectCaptain(player)}
                  style={{
                    width: 40, // Ensure the width and height are equal for the circle
                    height: 40,
                    borderRadius: 20, // Half of the width/height for a perfect circle
                    borderWidth: 2, // Thickness of the border
                    borderColor: colors.lightGray, // Border color
                    alignItems: 'center', // Center the text horizontally
                    justifyContent: 'center', // Center the text vertically
                    marginHorizontal: 5, // Optional: Space between circles
                    backgroundColor: isCaptain
                      ? colors.scarletRed
                      : 'transparent',
                  }}>
                  <Text
                    style={[
                      homeStyle.captainPointsText,
                      {
                        fontSize: 15,
                        color: isCaptain ? colors.white : colors.black,
                      },
                    ]}>
                    {'C'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // height: 80,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                <TouchableOpacity
                  onPress={() => handleSelectViceCaptain(player)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: colors.lightGray, // Border color
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isViceCaptain
                      ? colors.scarletRed
                      : 'transparent',
                    marginHorizontal: 5,
                  }}>
                  <Text
                    style={[
                      homeStyle.captainPointsText,
                      {
                        fontSize: 15,
                        color: isViceCaptain ? colors.white : colors.black,
                      },
                    ]}>
                    {'VC'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </>
    );

    return (
      <View>
        {groupedPlayers.map(({role, players}) =>
          players.length > 0 ? renderSection(role, players) : null,
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={homeStyle.safeArea}>
      <HeaderWithBackButton
        title={title}
        onBackButton={() => navigation.goBack()}
      />
      <View style={homeStyle.ContestDetailContainer}>
        <View style={homeStyle.containerCaptain}>
          <View style={homeStyle.section}>
            <View style={{flexDirection: 'column'}}>
              {selectedCaptain ? (
                <>
                  <FastImage
                    source={{
                      uri:
                        `${imageBaseUrl + selectedCaptain.image}` ||
                        defaultImage,
                    }}
                    // source={{uri: selectedCaptain.image}}
                    style={{height: 80, width: 80, borderRadius: 40}}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      // left: 10,
                      right: 0,
                      width: 80,
                      height: 20,
                      backgroundColor: colors.white, // Semi-transparent background
                      // paddingVertical: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.white,
                      zIndex: 1, // Ensure the box is above the image
                    }}>
                    <Text
                      style={[
                        homeStyle.captainPointsText,
                        {fontSize: 12, color: colors.scarletRed},
                      ]}>
                      {selectedCaptain && selectedCaptain.name
                        ? selectedCaptain.name.includes(' ') // Check if the name contains a space
                          ? selectedCaptain.name
                              .split(' ')
                              .map((part, index) =>
                                index === 0 ? `${part[0]}.` : part,
                              )
                              .join(' ') // Shorten first name, leave last name as is
                          : selectedCaptain.name
                        : 'Captain'}{' '}
                      {/* Fallback to empty string if selectedCaptain or name is undefined */}
                    </Text>
                  </View>
                </>
              ) : (
                <EvilIcons
                  name={'user'}
                  size={80}
                  color={colors.lightGray}
                  style={homeStyle.iconWrapper}
                />
              )}
            </View>
            {/* Box at the bottom of the image */}

            <View style={{}}>
              <Text style={homeStyle.captainText}>{'Captain'}</Text>
              <Text style={homeStyle.captainPointsText}>{'2x Points'}</Text>
            </View>
          </View>

          <View style={{backgroundColor: colors.scarletRed, flex: 1}}>
            <View style={homeStyle.section}>
              <View style={{}}>
                {selectedViceCaptain ? (
                  <>
                    <FastImage
                      source={{
                        uri:
                          `${imageBaseUrl + selectedViceCaptain.image}` ||
                          defaultImage,
                      }}
                      style={{height: 80, width: 80, borderRadius: 40,}}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        // left: 10,
                        right: 0,
                        width: 80,
                        height: 20,
                        backgroundColor: colors.white, // Semi-transparent background
                        // paddingVertical: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.white,
                        zIndex: 1, // Ensure the box is above the image
                      }}>
                      <Text
                        style={[
                          homeStyle.captainPointsText,
                          {fontSize: 12, color: colors.scarletRed},
                        ]}>
                        {selectedViceCaptain && selectedViceCaptain.name
                          ? selectedViceCaptain.name.includes(' ') // Check if the name contains a space
                            ? selectedViceCaptain.name
                                .split(' ')
                                .map((part: any, index: any) =>
                                  index === 0 ? `${part[0]}.` : part,
                                )
                                .join(' ') // Shorten first name, leave last name as is
                            : selectedViceCaptain.name
                          : 'Vice Captain'}
                        {/* Fallback to empty string if selectedCaptain or name is undefined */}
                      </Text>
                    </View>
                  </>
                ) : (
                  <EvilIcons
                    name={'user'}
                    size={80}
                    color={colors.lightGray}
                    style={{
                      height: 80,
                      width: 80,
                    }}
                  />
                )}
              </View>

              <View style={{}}>
                <Text style={homeStyle.captainText}>{'Vice Captain'}</Text>
                <Text style={homeStyle.captainPointsText}>{'1.5x Points'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={homeStyle.footerSelect}>
          <View style={homeStyle.footerItem}>
            <Text style={homeStyle.footerText}>{'Type'}</Text>
            <AntDesign
              name="arrowdown"
              size={14}
              color={colors.black}
              style={homeStyle.arrowIcon}
            />
          </View>
          <View style={homeStyle.footerItem}>
            <Text style={homeStyle.footerText}>{'Points'}</Text>
            <AntDesign
              name="arrowdown"
              size={14}
              color={colors.black}
              style={homeStyle.arrowIcon}
            />
          </View>
          <View style={[homeStyle.footerItem, {flexDirection: 'column'}]}>
            <Text style={homeStyle.footerText}>{'% C By'}</Text>
          </View>
          <View style={[homeStyle.footerItem, {flexDirection: 'column'}]}>
            <Text style={homeStyle.footerText}>{'% Vc By'}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{paddingBottom: 200}}>
          <View style={{flex: 1}}>
            {renderPlayerList(paramsData)}
            {/* <View style={{height:80, backgroundColor:"green"}}>

            </View> */}
          </View>
        </ScrollView>
      </View>

      <BottomButton
        leftButton={{
          title: 'Preview',
          icon: 'eye',
          onPress :() => {
            // navigation.navigate('TeamPreviewScreen', {params: paramsData});
            //@ts-ignore
            // navigation.navigate('TeamPreviewScreen', {
            //   params: allPlayers,
            //   paramsData: paramsData,
            //   fromButton: 'joinContest',
            // })
          },
        }}
        rightButton={{
          title: 'Next',
          icon: 'arrow-right',
          onPress : () => {
            if (selectedCaptain === null || selectedViceCaptain === null) {
              Alert.alert(
                '',
                'Please select both a Captain and a Vice-Captain before creating your team.',
              );
            } else {
              createTeamApiCalling();

              // Proceed with your logic if both are not null
              // For example:
              // doSomethingWithSelection(selectedCaptain, selectedViceCaptain);
            }
          
          }
          
          }
        }
      />


     
    </SafeAreaView>
  );
}
