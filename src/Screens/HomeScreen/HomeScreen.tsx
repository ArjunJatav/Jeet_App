import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import HomeHeader from '../../Components/Header/HomeHeader';
import {homeStyle} from './styles';
import {colors} from '../../Components/Colors';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeParamList} from './navigation-types';
import {fetchMatchList, updateFcmTokenApi} from './HomeApiProvider';
import {RootState} from '../../Redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserProfileDetails} from '../ProfileScreen/ApiProvider';
import {setProfile} from '../../Redux/profileDataSlice';
import {MaterialCommunityIcons} from '../../Components/ReactIcons/ReactIcon';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {myContestStyle} from '../MyContestScreen/styles';

let windowWidth = Dimensions.get('window').width;
type NavigationProp = NativeStackNavigationProp<HomeParamList, 'HomeScreen'>;

interface Match {
  data: any; // Replace `any` with the actual structure of the match data
}
export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [pageValue, setPageValue] = useState(1); // Start with page 1
  const [isFetching, setIsFetching] = useState(false); // Prevent multiple API calls
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  const deviceFcmToken = useSelector(
    (state: RootState) => state.fcmToken.fcmToken,
  );
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );
  //   *** *** funcation for fatching MatchesList ***  *** //
  const fetchMatches = useCallback(async () => {
    setIsFetching(true);

    try {
      const response = await fetchMatchList(
        authToken ?? '',
        pageValue.toString(),
      );
      const newData = response.data;

      if (newData.length === 0) {
        setIsFetching(false);
        return;
      }

      if (matchesList.length === 0) {
        setMatchesList(newData);
      } else {
        const dataWithoutHeaders = newData.map((section: Match) => ({
          data: section.data,
        }));
        setMatchesList(prevMatches => [...prevMatches, ...dataWithoutHeaders]);
      }
    } catch (error: any) {
      console.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [pageValue, authToken, matchesList]);

  useEffect(() => {
    fetchMatches();
  }, [pageValue, authToken]);

  useEffect(() => {
    fetchUserProfileDetail(); // Initial fetch when the component mounts
  }, [authToken]);

  //   *** *** funcation for methodUpdateFcmToken ***  *** //
  const methodUpdateFcmToken = useCallback(
    async () => {
      if (!deviceFcmToken) return; // Ensure token is available

      let paramsIteams = {
        device_type: Platform.OS === 'ios' ? 'ios' : 'Android',
        device_token: deviceFcmToken,
      };

      try {
        const response = await updateFcmTokenApi(paramsIteams, authToken ?? '');
        console.log('Update FCM Token Response:', response);
      } catch (error: any) {
        console.error('Error occurred:', error.message || 'An error occurred');
      }
    },
    [authToken, deviceFcmToken], // Dependencies
  );

  useEffect(() => {
    if (!reduceUserProfileData?.device_token) {
      methodUpdateFcmToken();
    }
  }, [reduceUserProfileData?.device_token, methodUpdateFcmToken]);

  //   *** *** funcation for change page Value ***  *** //
  const handleEndReached = useCallback(() => {
    if (!isFetching && matchesList.length > 0) {
      // Ensure we only call the API if we're not fetching and matchesList has items
      setPageValue(prevPage => {
        const nextPage = prevPage + 1;
        // console.log('nextPage', nextPage); // Log the next page value
        return nextPage; // Increment the page value
      });
    } else if (matchesList.length === 0) {
      console.log('No data to fetch; skipping API call.');
    }
  }, [isFetching, matchesList]);

  //   *** *** funcation for fetch Profiledata ***  *** //
  // Function to fetch profile data
  const fetchUserProfileDetail = useCallback(async () => {
    setLoading(true); // Show loader when fetching data

    try {
      const response = await fetchUserProfileDetails(authToken ?? ''); // Call updated function
      dispatch(setProfile(response.data)); // Dispatch the profile data
    } catch (err: any) {
      console.error(err.message || 'An error occurred');
    } finally {
      setLoading(false); // Hide loader when fetching is done
    }
  }, [authToken]);

  //   *** *** PAGINATION WORK ***  *** //
  const handleScroll = useCallback(
    (event: any) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const contentOffsetY = event.nativeEvent.contentOffset.y;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;
      if (contentOffsetY + layoutHeight >= contentHeight - 1 && !isFetching) {
        handleEndReached(); // Call the end reached logic when scrolled to the bottom
      }
    },
    [isFetching, handleEndReached],
  );

  //   *** *** card view ***  *** //
  const MatchCard = ({match, matchLength}: any) => {
    // console.log('matchmatchmatch', match);

    const team1Data = JSON.parse(match?.team1 || '{}');
    const team2Data = JSON.parse(match?.team2 || '{}');
    const team1Name = team1Data?.teamSName;
    const team1Image = team1Data?.image;
    const team2Name = team2Data?.teamSName;
    const team2Image = team2Data?.image;

    return (
      <View>
        <TouchableOpacity
          style={[
            homeStyle.matchCard,
            {
              height: 130,
              width: windowWidth - 20,
              marginRight: 10,
            },
          ]}>
          <View style={myContestStyle.matchTitleContainer}>
            <View style={myContestStyle.matchTitleBackGround}>
              <Text style={[myContestStyle.matchTitleText]}>
                {match?.match_format}
              </Text>
            </View>
          </View>

          <View style={{height: 70}}>
            <View style={myContestStyle.matchTeamRow}>
              <Text
                style={[
                  homeStyle.matchDetails,
                  {color: colors.black, fontSize: 16},
                ]}>
                {team1Name}
              </Text>
              <Text
                style={[
                  homeStyle.matchDetails,
                  {color: colors.black, fontSize: 16},
                ]}>
                {team2Name}
              </Text>
            </View>
            <View
              style={[
                myContestStyle.matchTeamRow,
                {height: 45, marginHorizontal: 0},
              ]}>
              {/* Left View */}
              <View style={myContestStyle.matchLeftTeamRow}>
                <View style={myContestStyle.matchLeftCornerTeamRow}>
                  <View style={myContestStyle.matchLeftCircleTeamRow} />
                </View>

                <FastImage
                  source={{
                    uri: imageBaseUrl + team1Image,
                  }}
                  style={myContestStyle.matchLeftflag}
                />
                <Text
                  style={[
                    homeStyle.matchDetails,
                    {color: colors.black, fontSize: 16},
                  ]}>
                  {team1Name}
                </Text>
              </View>

              {/* Center View */}
              <View style={myContestStyle.matchLeftTeamRow}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[{color: 'red', fontSize: 14, textAlign: 'center'}]}>
                    {match?.day}
                  </Text>
                </View>
              </View>

              {/* Right View */}
              <View
                style={[
                  myContestStyle.matchLeftTeamRow,
                  {justifyContent: 'flex-end'},
                ]}>
                <Text
                  style={[
                    homeStyle.matchDetails,
                    {color: colors.black, fontSize: 16, marginRight: 10},
                  ]}>
                  {team2Name}
                </Text>
                <FastImage
                  source={{
                    uri: imageBaseUrl + team2Image,
                  }}
                  style={[
                    myContestStyle.matchLeftflag,
                    {marginRight: -5, marginLeft: 0},
                  ]}
                />
                <View
                  style={[
                    myContestStyle.matchLeftCornerTeamRow,
                    {
                      borderBottomStartRadius: 10,
                      borderTopStartRadius: 10,
                      marginRight: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  ]}>
                  <View
                    style={[
                      myContestStyle.matchLeftCircleTeamRow,
                      {right: 10, left: 0},
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={homeStyle.footer}>
            <Text style={[homeStyle.matchDetails, {color: colors.black}]}>
              {'Joined >>'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const MyMatches = () => {
    const myMatches = matchesList.find(
      (section: any) => section.title === 'Current Matches',
    )?.data;

    return (
      <View style={{flex: 1}}>
        {myMatches && myMatches.length > 0 && (
          <>
            {/* Title */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text
                style={[
                  homeStyle.sectionHeader,
                  {
                    justifyContent: 'flex-start',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                ]}>
                {'My Matches'}
              </Text>
              <Text
                style={[
                  homeStyle.sectionHeader,
                  {justifyContent: 'flex-end', fontSize: 16},
                ]}>
                {'View All'}
              </Text>
            </View>

            {/* FlatList with Horizontal Scroll */}
            <FlatList
              data={myMatches}
              renderItem={({item}) => (
                <MatchCard match={item} matchLength={myMatches.length} />
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
            />
          </>
        )}
      </View>
    );
  };

  const renderMatchDataItem = ({item, index}: any) => {
    // console.log('item', item?.team1);

    const team1 = JSON.parse(item?.team1);
    const team2 = JSON.parse(item?.team2);
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.contests_count === 0) {
            // Show alert if contests_count is 0
            Alert.alert(
              'No Contests',
              'There are no contests available at the moment.',
            );
          } else {
            // console.log(item);

            // Navigate if contests_count is not 0
            navigation.navigate('ContestDetails', {params: item});
          }
        }}
        style={[
          homeStyle.matchCard,
          {
            height: 170,
            width: '100%',
            // opacity: item.contests_count === 0 ? 0.6 : 1,
          },
        ]}>
        <View style={homeStyle.header}>
          <Text style={homeStyle.matchDetails}>
            {`${item.match_format} (${item.match_desc})`}{' '}
            {/* Template literal */}
          </Text>
    
        </View>

        <View style={homeStyle.matchInfo}>
         
          <View style={homeStyle.matchRow}>
            {/* Left View */}
            <View style={homeStyle.teamInfoget}>
           

              <FastImage
                source={{
                  uri: imageBaseUrl + team1.image,
                }}
                style={homeStyle.flagImageHH}
              />
              <Text
                style={[
                  homeStyle.matchDetails,
                  {color: colors.black, fontSize: 12},
                ]}>
                {team1.teamSName}
              </Text>
            </View>

            {/* Center View */}
            <View style={homeStyle.centerInfo}>
              <View
                style={{
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // backgroundColor:"red"
                }}>
                {item.state === 'Live' && (
                  <Text
                    style={[
                      {
                        color: colors.scarletRed,
                        fontSize: 15,
                        fontWeight: '600',
                      },
                    ]}>
                    {'Start at ' +
                      new Intl.DateTimeFormat('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true, // 12-hour format with AM/PM
                      }).format(new Date(item.start_date))}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    marginTop: item.state != 'Live' ? 20 : 5,
                  }}>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Text
                      style={[
                        homeStyle.matchDetails,
                        {
                          color: colors.black,
                          fontSize: 14,
                          fontWeight: '500',
                          fontStyle: 'italic',
                        },
                      ]}>
                      {team1.teamName?.substring(0, 10).toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    style={[
                      homeStyle.matchDetails,
                      {
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: '600',
                        fontStyle: 'italic',
                      },
                    ]}>
                    {'VS'}
                  </Text>

                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text
                      style={[
                        homeStyle.matchDetails,
                        {
                          color: colors.black,
                          fontSize: 14,
                          fontWeight: '500',
                          fontStyle: 'italic',
                        },
                      ]}>
                      {team2.teamName?.slice(0, 10).toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right View */}
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                height: '100%', // Matches the parent height
                // width: windowWidth / 3.33, // Takes 30% of the parent width
              }}>
              <FastImage
                source={{
                  uri: imageBaseUrl + team2.image,
                }}
                style={homeStyle.flagImageH}
              />
              <Text
                style={[
                  homeStyle.matchDetails,
                  {
                    color: colors.black,
                    fontSize: 12,
                    // marginRight: 10,
                  },
                ]}>
                {team2.teamSName} {/* Display short name of team1 */}
              </Text>

            </View>
          </View>
        </View>
        <View style={homeStyle.footer}>

          {item.state != 'Live' ? (
            <>
              <Text
                style={[
                  {
                    color: item.state != 'Live' ? colors.scarletRed : 'red',
                    fontSize: 15,
                    fontWeight: '700',
                  },
                ]}>
                {item.day},
              </Text>
              <Text
                style={[
                  {
                    color: item.state != 'Live' ? colors.scarletRed : 'red',
                    fontSize: 15,
                    fontWeight: '700',
                  },
                ]}>
                at{' '}
                {new Intl.DateTimeFormat('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true, // 12-hour format with AM/PM
                }).format(new Date(item.start_date))}
              </Text>
            </>
          ) : (
            <View
              style={{
                backgroundColor: colors.scarletRed,
                borderRadius: 5,
                height: 30,
                marginBottom: 10,
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  {
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: '700',
                  },
                ]}>
                {'Make Your Team'}
              </Text>
            </View>
          )}

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.white}}>
      {/* Profile Drawer   onPress={() => navigation.openDrawer()} */}

      <View>
        <HomeHeader
          title="Bizz 11"
          onProfileClick={() => {
            //@ts-ignore
            navigation.openDrawer();
          }}
          onNotificationClick={() => {
            //@ts-ignore
            navigation.navigate('NotificationScreen');
          }}
          onWalletClick={() => {
            //@ts-ignore
            navigation.navigate('WalletWithdrawScreen');
          }}
        />
        <View style={homeStyle.HomeContainer}>
          <ScrollView
          
            onScroll={() => {
              matchesList.filter((item: any) => item.data.length > 0).length >
              20
                ? handleScroll
                : null;
            }} // Detect scroll position
            scrollEventThrottle={400} // Control how often onScroll fires (lower value = more frequent)
          >
            {matchesList.filter((item: any) => item.data.length > 0).length >
            0 ? (
              <>
                <MyMatches />

                <SectionList
                  sections={matchesList.filter(
                    (item: any) =>
                      item.title !== 'Current Matches' && item.data.length > 0, // Exclude sections with empty data
                  )}
                  keyExtractor={(item, index) => item.cricbuzz_match_id + index}
                  renderItem={renderMatchDataItem}
                  //@ts-ignore
                  renderSectionHeader={({section: {title}}) => {
                    // if (pageValue === 1) {
                    return (
                      <Text style={[homeStyle.sectionHeader]}>
                        {title || ''}
                      </Text>
                    );
                   
                  }}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={{paddingBottom: 250}}
                  ListFooterComponent={
                    isFetching ? (
                      <View style={{padding: 16, alignItems: 'center'}}>
                        <ActivityIndicator
                          size="large"
                          color={colors.lightBlue}
                        />
                      </View>
                    ) : null
                  }
                />
              </>
            ) : (
              <View style={myContestStyle.noDataContainer}>
                <Image
                  source={require('../../Assets/No_Data_found.png')}
                  style={{height: windowWidth / 2, width: windowWidth / 2}}
                  resizeMode="cover"
                />
                <Text style={myContestStyle.noDataText}>No Data Found!</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
