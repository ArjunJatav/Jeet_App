import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeHeader from '../../Components/Header/HomeHeader';
import PagerView from 'react-native-pager-view';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {fetchMyContestList} from './MyContestApiProvide';
import {colors} from '../../Components/Colors';
import {homeStyle} from '../HomeScreen/styles';
import {myContestStyle} from './styles';
import {imageBaseUrl} from '../../ConstantFiles/Api';
let windowWidth = Dimensions.get('window').width;

export default function MatchesScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [myContestList, setMyContestList] = useState([]);

  const pagerRef = useRef<PagerView>(null); // Explicitly type pagerRef

  const handleTabPress = (tabIndex: any) => {
    setSelectedTab(tabIndex);
    pagerRef.current?.setPage(tabIndex); // Programmatically navigate to the tab
  };
  // Function to fetch my matches data
  const fetchMyMatches = useCallback(() => {
    fetchMyContestList(
      response => {
        // console.log("response.data",response.data);

        setMyContestList(response.data);
        setRefreshing(false);
      },
      error => {
        console.error(error.message || 'An error occurred');
        setRefreshing(false);
      },
      statusError => {
        console.warn(statusError.message || 'Status is false');
        setRefreshing(false);
      },
      authToken ?? '',
    );
  }, [fetchMyContestList, authToken]);

  const completeMatches =
    myContestList.find(
      (item: any) => item.title === 'Complete Matches', //@ts-ignore
    )?.data || [];
  const upcomingMatches =
    myContestList.find(
      (item: any) => item.title === 'Upcoming Matches', //@ts-ignore
    )?.data || [];
  const liveMatches =
    myContestList.find(
      (item: any) => item.title === 'Live Matches', //@ts-ignore
    )?.data || [];

  // console.log('myContestList', upcomingMatches);
  // Fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchMyMatches();
    }, [fetchMyMatches]),
  );

  const MyContestView = ({data, title}: {data: any; title: string}) => {
    console.log('Title:', title); // This will log "LIVE"
    // This will log the passed `liveMatches`

    return (
      <View style={{flex: 1, width: windowWidth - 20, marginTop: 10}}>
        {data && data.length > 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={colors.scarletRed} // Change the spinner color for iOS
                refreshing={refreshing} // Controls the loading spinner
                onRefresh={() => fetchMyMatches()} // Triggered when user pulls to refresh
              />
            }
            data={data}
            contentContainerStyle={{paddingBottom: 250}}
            renderItem={({item}) => <MatchCard match={item} title={title} />}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
          />
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
      </View>
    );
  };

  // const MatchCard = ({match}: any, title:String) => {
  const MatchCard = ({match, title}: {match: any; title: string}) => {
    // console.log('matchmatchmatch', match);

    const team1Data = JSON.parse(match?.team1 || '{}');
    const team2Data = JSON.parse(match?.team2 || '{}');
    const team1Name = team1Data?.teamSName;
    const team1Image = team1Data?.image;
    const team2Name = team2Data?.teamSName;
    const team2Image = team2Data?.image;
    return (
      <TouchableOpacity
        onPress={() => {
          if (title === 'RESULTS') {
            //@ts-ignore
            // navigation.navigate('LiveContestScreen', {params: match});
            navigation.navigate('CompleteContest', {params: match});
          } else if (title === 'LIVE') {
            //@ts-ignore
            navigation.navigate('LiveContestScreen', {params: match});
          } else {
            //@ts-ignore
            // navigation.navigate('LiveContestScreen', {params: match});

            navigation.navigate('UpcommingContest', {params: match});
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
        <View
          style={[
            homeStyle.header,
            {justifyContent: 'space-between', paddingHorizontal: 10},
          ]}>
          <Text style={homeStyle.matchDetails}>
            {`${match.match_format} (${match.match_desc})`}{' '}
            {/* Template literal */}
          </Text>
          <Text style={[homeStyle.matchDetails,{color:title === 'LIVE' ? colors.red : colors.scarletRed}]}>
            {title === 'LIVE'
              ? 'Live'
              : title === 'RESULTS'
              ? 'Completed'
              : match?.day}
          </Text>
        </View>

        <View style={homeStyle.matchInfo}>
          <View style={homeStyle.matchRow}>
            {/* Left View */}
            <View style={homeStyle.teamInfoget}>
              <FastImage
                source={{
                  uri: imageBaseUrl + team1Data.image,
                }}
                style={homeStyle.flagImageHH}
              />
              <Text
                style={[
                  homeStyle.matchDetails,
                  {color: colors.black, fontSize: 12},
                ]}>
                {team1Data.teamSName}
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
                {match.state === 'Live' && (
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
                      }).format(new Date(match.start_date))}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    marginTop: match.state != 'Live' ? 20 : 5,
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
                      {team1Data.teamName?.substring(0, 10).toUpperCase()}
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
                      {team2Data.teamName?.slice(0, 10).toUpperCase()}
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
                  uri: imageBaseUrl + team2Data.image,
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
                {team2Data.teamSName} {/* Display short name of team1 */}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            homeStyle.footer,
            {justifyContent: 'space-between', backgroundColor: '#F5F5F5'},
          ]}>
          <Text style={[homeStyle.matchDetails, {color: colors.black}]}>
            {`Team${match?.joined_teams_count > 1 ? `s: ` : `: `}${
              match?.joined_teams_count
            }`}
          </Text>
          <Text style={[homeStyle.matchDetails, {color: colors.black}]}>
            <Text>{`Joined Contest${
              match?.join_contest_count > 1 ? 's' : ''
            }: ${match?.join_contest_count}`}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: '#FFF'}}>
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
        <View style={myContestStyle.myContestContainer}>
          {/* Tab Navigation */}
          <View style={homeStyle.tabContainer}>
            {/* Tab 1 */}
            <TouchableOpacity
              style={[
                homeStyle.tabButton,
                selectedTab === 0 && homeStyle.selectedTabButton,
              ]}
              onPress={() => handleTabPress(0)}>
              <Text
                style={[
                  homeStyle.tabText,
                  selectedTab === 0 && homeStyle.selectedTabText,
                  {fontWeight: selectedTab === 0 ? '600' : '500'},
                ]}>
                Upcomming
              </Text>
            </TouchableOpacity>

            {/* Tab 2 */}
            <TouchableOpacity
              style={[
                homeStyle.tabButton,
                selectedTab === 1 && homeStyle.selectedTabButton,
              ]}
              onPress={() => handleTabPress(1)}>
              <Text
                style={[
                  homeStyle.tabText,
                  selectedTab === 1 && homeStyle.selectedTabText,
                  {fontWeight: selectedTab === 1 ? '600' : '500'},
                ]}>
                Live
              </Text>
            </TouchableOpacity>

            {/* Tab 3 */}
            <TouchableOpacity
              style={[
                homeStyle.tabButton,
                selectedTab === 2 && homeStyle.selectedTabButton,
              ]}
              onPress={() => handleTabPress(2)}>
              <Text
                style={[
                  homeStyle.tabText,
                  selectedTab === 2 && homeStyle.selectedTabText,
                  {fontWeight: selectedTab === 2 ? '600' : '500'},
                ]}>
                Results
              </Text>
            </TouchableOpacity>
          </View>
          {/* PagerView for Tab Content */}
          {/* PagerView for Tab Content */}
          <PagerView
            ref={pagerRef} // Attach the ref
            style={{flex: 1}}
            initialPage={0}
            onPageSelected={e => setSelectedTab(e.nativeEvent.position)}>
            {/* Upcoming */}
            <View
              key="1"
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <MyContestView data={upcomingMatches || []} title={'UPCOMMING'} />
            </View>

            {/* Live */}
            <View
              key="2"
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <MyContestView data={liveMatches || []} title={'LIVE'} />
            </View>

            {/* Results */}
            <View
              key="3"
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <MyContestView data={completeMatches || []} title={'RESULTS'} />
            </View>
          </PagerView>
        </View>
      </View>
    </SafeAreaView>
  );
}
