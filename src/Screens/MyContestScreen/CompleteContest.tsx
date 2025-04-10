import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../Components/Colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import PagerView from 'react-native-pager-view';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import {homeStyle} from '../HomeScreen/styles';
import FastImage from 'react-native-fast-image';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {
  getContestTeam,
  myCompleteContestList,
  myContestList,
} from './MyContestApiProvide';
import {Entypo, Octicons} from '../../Components/ReactIcons/ReactIcon';
import {LOCALTEXT} from '../../Language/AllTextProvider';
interface Contest {
  data: any;
}
let windowWidth = Dimensions.get('window').width;

export default function CompleteContest(route: any) {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const matchID = route?.route?.params?.params?.id;
  const paramsData = route?.route?.params?.params;
  const [selectedTab, setSelectedTab] = useState(0);
  const [contestsList, setContestsList] = useState<Contest[]>([]);
  const [teamData, setTeamData] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  const team1 = paramsData ? JSON.parse(paramsData.team1) : {};
  const team2 = paramsData ? JSON.parse(paramsData.team2) : {};

  // *** *** Function for fetching ContestData & TeamData ***  *** //
  const fetchContests = useCallback(() => {
    if (!matchID) return;

    // *** *** API call for ContestList and TeamData ***  *** //
    const fetchData = async () => {
      try {
        const contestResponse = await myCompleteContestList(
          authToken ?? '',
          matchID.toString(),
        );
        setContestsList(contestResponse.data.data);

        const teamResponse = await getContestTeam(
          authToken ?? '',
          matchID.toString(),
        );
        const parsedData = teamResponse.map((team: any) => ({
          ...team,
          team_data: JSON.parse(team.team_data),
        }));
        setTeamData(parsedData);
        // console.log("contestsList",contestsList);

        // setTeamData(contestsList);
      } catch (error: any) {
        console.error(error.message || 'An error occurred');
      } finally {
        console.log('FINAL');

        setLoading(false); // Set loading to false once both API calls are complete
      }
    };

    fetchData();
  }, [matchID, authToken]);

  useEffect(() => {
    if (matchID) {
      setContestsList([]);
      setLoading(true); // Set loading to true when starting the fetch
      fetchContests();
    }
  }, [matchID, fetchContests]);
  console.log('contestsList', contestsList);
  //   *** *** ContestList View ***  *** //
  const MatchesList = () => {
    return (
      <View style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.lightBlue}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          />
        ) : (
          <FlatList //@ts-ignore
            data={selectedTab === 0 ? contestsList?.contests : teamData}
            renderItem={({item, index}) => (
              <MatchCard match={item} teamIndex={index} /> // Pass teamIndex here
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={homeStyle.sectionListContainer}
            showsVerticalScrollIndicator={false} // Hide the horizontal scroll indicator
          />
        )}
      </View>
    );
  };

  //   *** *** Contest View && TeamView  ***  *** //
  const MatchCard = ({match, teamIndex}: any) => {
    // console.log('matchmatchmatch', match);

    const isTeamDataEmpty = !match.team_data || match.team_data.length === 0;
    let captain = null;
    let viceCaptain = null;
    let batterCount = 0;
    let wicketkeeperCount = 0;
    let allRounderCount = 0;
    let bowlerCount = 0;
    if (!isTeamDataEmpty) {
      captain = match.team_data.find((player: any) => player.is_captain);
      viceCaptain = match.team_data.find(
        (player: any) => player.is_vice_captain,
      );

      // Count players based on their role
      batterCount = match.team_data.filter(
        (player: any) => player.role === 'Batsman',
      ).length;
      wicketkeeperCount = match.team_data.filter(
        (player: any) => player.role === 'WK-Batsman',
      ).length;
      allRounderCount = match.team_data.filter(
        (player: any) =>
          player.role === 'Batting Allrounder' ||
          player.role === 'Bowling Allrounder',
      ).length;
      bowlerCount = match.team_data.filter(
        (player: any) => player.role === 'Bowler',
      ).length;
    }
    const rolesData = [
      {
        role: 'WK',
        count: wicketkeeperCount,
        color: 'yellow',
        iconColor: 'black',
      },
      {role: 'BT', count: batterCount, color: 'red', iconColor: 'white'},
      {
        role: 'AR',
        count: allRounderCount,
        color: 'green',
        iconColor: 'white',
      },
      {role: 'BW', count: bowlerCount, color: 'blue', iconColor: 'white'},
    ];

    let joiningWirth = 0;
    let joiningLeftWidth = 0;

    if (match.sports_left > 0) {
      const totalWidth = 100;

      joiningWirth = (match.sports_left / match.allowed_team) * totalWidth;
      joiningLeftWidth = totalWidth - joiningWirth;
    }

    return (
      <>
        {isTeamDataEmpty ? (
          <View
            style={[
              homeStyle.matchCardForContest,
              {width: windowWidth - 20, height: 120},
            ]}>
            <View style={[homeStyle.cardContent, {flexDirection: 'column'}]}>
              <View style={homeStyle.cardLeft}>
                <Text
                  style={[homeStyle.matchTitle, {color: colors.scarletRed}]}
                  numberOfLines={1}>
                  {match.series.name}
                </Text>

                <View
                  style={{
                    backgroundColor: '#f5f9fa',
                    padding: 5,
                    marginTop: 10,
                    borderRadius: 5,
                  }}>
                  <View style={[homeStyle.cardRow, {marginVertical: 2}]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          homeStyle.matchSpots,
                          {fontSize: 18, color: colors.black},
                        ]}>
                        {'Win : '}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          homeStyle.matchSpots,
                          {
                            fontSize: 18,
                            color: colors.black,
                            fontWeight: '600',
                          },
                        ]}>
                        {LOCALTEXT.CURRENCY_SYMBOL + match.win_price}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 1,
                        backgroundColor: colors.black,
                        height: '100%',
                      }}></View>
                    <Text
                      style={[
                        homeStyle.matchSpots,
                        {fontSize: 15, color: colors.black},
                      ]}>{`Total Participants: ${match.total_participants}`}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#f5f9fa',
                  height: 35,
                  flexDirection: 'row',

                  // marginTop: 10,
                  borderBottomStartRadius: 10,
                  borderBottomEndRadius: 10,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.modalOpacity,
                    }}>
                    {'Joined With : '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.black,
                    }}>
                    {match.user_teams.team_name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.modalOpacity,
                    }}>
                    {'Points : '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.black,
                    }}>
                    {match.points}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.modalOpacity,
                    }}>
                    {'Rank : '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.black,
                    }}>
                    {match.rank}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View
              style={[
                homeStyle.matchCardForContest,
                {width: windowWidth - 20, height: 180},
              ]}>
              <View style={[homeStyle.cardContent, {flexDirection: 'column'}]}>
                <View style={homeStyle.teamHeaderData}>
                  <Text
                    style={[
                      homeStyle.matchTitle,
                      {color: colors.white, marginTop: 0},
                    ]}>
                    {match.team_name}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <View style={homeStyle.teamcaptaionVc}>
                    <Text
                      style={[
                        homeStyle.matchTitle,
                        {color: colors.scarletRed, marginTop: 0},
                      ]}>
                      {captain.name}(C)
                    </Text>

                    <Text
                      style={[
                        homeStyle.matchTitle,
                        {marginTop: 0, color: colors.scarletRed},
                      ]}>
                      {viceCaptain.name}(VC)
                    </Text>
                  </View>
                  <View
                    style={[homeStyle.teamcaptaionVc, {paddingHorizontal: 0}]}>
                    {rolesData.map((item, index) => (
                      <View
                        key={index}
                        style={homeStyle.teamcaptaionallPlayers}>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            //  backgroundColor: colors.lightBlue, // Dynamic background color for role
                            borderRadius: 20, // Rounded corners for role section
                            paddingVertical: 0, // Vertical padding for better spacing
                          }}>
                          <Text
                            style={[
                              homeStyle.matchTitle,
                              {color: colors.scarletRed, marginTop: 0}, // Text color for the role
                            ]}>
                            {item.role}
                          </Text>
                        </View>

                        <Text
                          style={[
                            homeStyle.matchTitle,
                            {color: colors.scarletRed, marginTop: 0}, // Text color for count
                          ]}>
                          {'-'}
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={[
                              homeStyle.matchTitle,
                              {color: colors.scarletRed, marginTop: 0}, // Text color for count
                            ]}>
                            {item.count}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[homeStyle.teamcaptaionVc, {height: 40, flex: 0}]}>
                  {/* <TouchableOpacity
                          style={[
                            homeStyle.tabButton,
                            {flexDirection: 'row', justifyContent: 'flex-start'},
                          ]}>
                          <Octicons
                            name={'pencil'}
                            size={18}
                            color={colors.darkBlue}
                            style={{
                              height: 18,
                              width: 18,
                              // marginLeft: 10,
                              marginRight: 5,
                            }}
                          />
                          <Text
                            style={[
                              homeStyle.matchTitle,
                              {color: colors.darkBlue, marginTop: 0},
                            ]}>{`Edit`}</Text>
                        </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      //@ts-ignore
                      navigation.navigate('TeamPreviewScreen', {
                        params: match.team_data,
                        paramsData: paramsData,
                      });
                    }}
                    style={[
                      homeStyle.tabButton,
                      {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        borderTopWidth: 1,
                        borderTopColor: colors.newGray,
                      },
                    ]}>
                    <Octicons
                      name={'eye'}
                      size={18}
                      color={colors.scarletRed}
                      style={{
                        height: 18,
                        width: 18,
                        // marginLeft: 10,
                        marginRight: 5,
                      }}
                    />
                    <Text
                      style={[
                        homeStyle.matchTitle,
                        {color: colors.scarletRed, marginTop: 0},
                      ]}>{`Preview`}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Checkbox Section */}
            </View>
          </>
        )}
      </>
    );
  };
  //@ts-ignore
  const matchData = contestsList?.match; // Extract match object properly

  const team1Score = matchData?.match_score
    ? JSON.parse(matchData.match_score)
    : {};
  const team2Score = matchData?.match_score
    ? JSON.parse(matchData.match_score)
    : {};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderWithBackButton
        title={team1.teamSName + ' Vs ' + team2.teamSName}
        onBackButton={() => navigation.goBack()}
      />

      <View style={homeStyle.ContestDetailContainer}>
        {/* TOP View */}
        <View style={[homeStyle.topViewContainer, {height: 130}]}>
      
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}>
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: 2,
                alignItems: 'center',
                borderBottomStartRadius: 5,
                borderBottomEndRadius: 5,
              }}>
              <Text style={[homeStyle.bannerText, {color: colors.green}]}>
                {'Completed'}
              </Text>
            </View>
          </View>

          {/* <View style={homeStyle.bannerContent}> */}

          {/* </View> */}
          {/* </View> */}

          {/* Main Content */}
          <View
            style={[
              homeStyle.mainContentContainer,
              {alignItems: 'center', marginBottom: 5},
            ]}>
            {/* Left View */}
            <View style={homeStyle.leftContainer}>
              <FastImage
                source={{
                  uri: imageBaseUrl + team1.image,
                }}
                style={homeStyle.flagImage}
              />
              <Text
                style={[
                  homeStyle.bannerText,
                  {color: colors.white, padding: 0, marginTop: 5, fontSize: 12},
                ]}>
                {team1.teamSName}
              </Text>
              <Text
                style={[homeStyle.teamName, {marginTop: 0, marginBottom: 15}]}>
                {' '}
                {team1Score?.team1Score?.inngs1?.runs}/
                {team1Score?.team1Score?.inngs1?.wickets}(
                {team1Score?.team1Score?.inngs1?.overs})
              </Text>
            </View>

            {/* VS View */}
            <View style={homeStyle.vsContainer}>
              <View style={homeStyle.vsBadge}>
                <Text style={homeStyle.vsText}>{'VS'}</Text>
              </View>
            </View>
            <View
              style={[
                {
                  backgroundColor: colors.spotScarletRed,
                  position: 'absolute',
                  width: '100%',
                  justifyContent: 'center',
                  bottom: 0,
                  alignItems: 'center',
                  zIndex: 110,
                },
              ]}>
              <Text
                style={[
                  homeStyle.bannerText,
                  {color: colors.black, fontSize: 12},
                ]}
                numberOfLines={1}>
                {matchData?.status}
              </Text>
            </View>
            {/* Right View */}
            <View style={homeStyle.rightContainer}>
              <FastImage
                source={{
                  uri: imageBaseUrl + team2.image,
                }}
                style={homeStyle.flagImage}
              />
              <Text
                style={[
                  homeStyle.bannerText,
                  {color: colors.white, padding: 0, marginTop: 5, fontSize: 12},
                ]}>
                {team2.teamSName}
              </Text>
              <Text
                style={[homeStyle.teamName, {marginTop: 0, marginBottom: 15}]}>
                {team2Score?.team2Score?.inngs1?.runs}/
                {team2Score?.team2Score?.inngs1?.wickets}(
                {team2Score?.team2Score?.inngs1?.overs})
              </Text>
            </View>
          </View>
        </View>
        {/* Tab Navigation */}
        <View style={homeStyle.tabContainer}>
          {/* Tab 1 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 0 && homeStyle.selectedTabButton,
            ]}
            onPress={() => {
              setSelectedTab(0);
            }}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 0 && homeStyle.selectedTabText,
                {fontWeight: '600'},
              ]}>
              {`My Contest${
                //@ts-ignore
                contestsList?.contests?.length > 1 ? 's' : ''
              } (${
                //@ts-ignore
                contestsList?.contests?.length
              })`}
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 1 && homeStyle.selectedTabButton,
            ]}
            onPress={() => {
              setSelectedTab(1);
            }}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 1 && homeStyle.selectedTabText,
                {fontWeight: '600'},
              ]}>
              {`Team${teamData.length > 1 ? 's' : ''} (${teamData.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        <PagerView
          style={{flex: 1}}
          initialPage={selectedTab}
          onPageSelected={e => {
            setSelectedTab(e.nativeEvent.position);
          }}>
          <MatchesList />
          <MatchesList />
        </PagerView>
      </View>
    </SafeAreaView>
  );
}
