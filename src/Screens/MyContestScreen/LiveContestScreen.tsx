import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
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
import {homeStyle} from '../HomeScreen/styles';
import FastImage from 'react-native-fast-image';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {
  getContestTeam,
  liveMatchApi,
  myCompleteContestList,
  myContestList,
} from './MyContestApiProvide';
import {Octicons} from '../../Components/ReactIcons/ReactIcon';
import {LOCALTEXT} from '../../Language/AllTextProvider';
interface Contest {
  data: any;
}
let windowWidth = Dimensions.get('window').width;

export default function LiveContestScreen(route: any) {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const matchID = route?.route?.params?.params?.id;
  const paramsData = route?.route?.params?.params;
  const [selectedTab, setSelectedTab] = useState(0);
  const [contestsList, setContestsList] = useState<Contest[]>([]);
  const [teamData, setTeamData] = useState<Contest[]>([]);
  const [liveMatchData, setLiveMatchData] = useState<Contest[]>([]);
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
        const liveMatchResponse = await liveMatchApi(
          authToken ?? '',
          paramsData.cricbuzz_match_id.toString(),
        );

        // console.log("liveMatchResponse",liveMatchResponse);

        setLiveMatchData(liveMatchResponse);

        const teamResponse = await getContestTeam(
          authToken ?? '',
          matchID.toString(),
        );
        const parsedData = teamResponse.map((team: any) => ({
          ...team,
          team_data: JSON.parse(team.team_data),
        }));
        setTeamData(parsedData);
        // console.log('contestsList', contestsList);

        // setTeamData(contestsList);
      } catch (error: any) {
        console.error(error.message || 'An error occurred');
      } finally {
        // console.log('FINAL');

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

  const LastSixBalls = ({ballsData}: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {ballsData.map((ball: any, index: any) => (
          <View
            key={index}
            style={{
              width: 18,
              height: 18,
              borderRadius: 15,
              backgroundColor: ball.color, // Color based on outcome
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 3,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {ball.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

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
          <FlatList
            data={
              //@ts-ignore
              selectedTab === 0 ? contestsList?.contests : teamData
            }
            refreshControl={
              <RefreshControl
                tintColor={colors.lightBlue} // Change the spinner color for iOS
                refreshing={loading} // Controls the loading spinner
                onRefresh={() => fetchContests()} // Triggered when user pulls to refresh
              />
            }
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
                          {fontSize: 15, color: colors.black},
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
                    {/* <Text
                      style={[
                        homeStyle.matchSpots,
                        {fontSize: 15, color: colors.black},
                      ]}>
                      {'Winner'}
                    </Text> */}
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
                      ]}>{`Total Participants: ${
                      match.contests.allowed_team - match.contests.sports_left
                    }`}</Text>
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

  const PlayerBattingInfo = ({player}: any) => {
    return (
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginVertical: 2}}>
        <Text style={{fontSize: 10, fontWeight: 'bold', color: colors.black}}>
          {player.name.length > 10 ? player.name.slice(0, 12) : player.name}
        </Text>
        <Text style={{fontSize: 10, color: colors.black, marginLeft: 8}}>
          {player.runs} ({player.balls})
        </Text>
        {player.isStriker && (
          <Text style={{fontSize: 10, color: colors.green, marginLeft: 4}}>
            ★
          </Text>
        )}
      </View>
    );
  };
  //@ts-ignore
  const firstInnings = liveMatchData?.scorecard?.scoreCard?.[0] || ''; //@ts-ignore
  const secondInnings = liveMatchData?.scorecard?.scoreCard?.[1] || ''; // Get the second innings, or null if not started

  // First innings details
  const firstInningsScore = firstInnings
    ? `${firstInnings.scoreDetails.runs}/${firstInnings.scoreDetails.wickets} (${firstInnings.scoreDetails.overs})`
    : '0/0 (0)';
  const firstInningsTeamShort =
    firstInnings?.batTeamDetails?.batTeamShortName == team1.teamSName
      ? team1.teamSName
      : team2.teamSName;

  // Second innings details
  const secondInningsScore = secondInnings
    ? `${secondInnings.scoreDetails.runs}/${secondInnings.scoreDetails.wickets} (${secondInnings.scoreDetails.overs})`
    : '0/0 (0)';
  const secondInningsTeamShort =
    secondInnings?.batTeamDetails?.batTeamShortName === team2.teamSName
      ? team2.teamSName
      : team1.teamSName;

  const secondTeamFlag =
    secondInnings?.batTeamDetails?.batTeamShortName === team2.teamSName
      ? imageBaseUrl + team2.image
      : imageBaseUrl + team1.image;
  const fristTeamFlag =
    firstInnings?.batTeamDetails?.batTeamShortName === team1.teamSName
      ? imageBaseUrl + team1.image
      : imageBaseUrl + team2.image;

  // Function to get the last batting partnership from innings data
  // Function to get the last batting partnership from innings data
  //@ts-ignore
  const getLastPartnership = innings => {
    // console.log("inningsinnings",innings);

    const partnershipsData = innings?.partnershipsData;

    if (partnershipsData && typeof partnershipsData === 'object') {
      const partnershipsKeys = Object.keys(partnershipsData);

      if (partnershipsKeys.length > 0) {
        const lastPartnershipKey =
          partnershipsKeys[partnershipsKeys.length - 1];
        const currentPartnership = partnershipsData[lastPartnershipKey];

        if (currentPartnership) {
          // Determine which player is on strike dynamically
          const strikeBatsman = currentPartnership?.strikeBatsman; // Example key for tracking striker

          const battingPlayers = [
            {
              name: currentPartnership?.bat1Name,
              runs: currentPartnership?.bat1Runs,
              balls: currentPartnership?.bat1balls,
              isStriker: currentPartnership?.bat1Name === strikeBatsman, // Compare with striker name
            },
            {
              name: currentPartnership?.bat2Name,
              runs: currentPartnership?.bat2Runs,
              balls: currentPartnership?.bat2balls,
              isStriker: currentPartnership?.bat2Name === strikeBatsman, // Compare with striker name
            },
          ];

          return battingPlayers;
        } else {
          return []; // No current partnership data found
        }
      } else {
        return []; // No partnerships data available
      }
    } else {
      return []; // partnershipsData is not available or not an object
    }
  };

  const lastSixBalls = [
    {value: '4', color: 'green'}, // Four runs
    {value: '1', color: 'blue'}, // Single run
    {value: 'W', color: 'red'}, // Wicket
    {value: '6', color: 'purple'}, // Six runs
    {value: '2', color: 'blue'}, // Two runs
    {value: '0', color: 'gray'}, // Dot ball
  ];

  // Get the last partnership for both innings
  const firstInningsLastPartnership = getLastPartnership(firstInnings);
  const secondInningsLastPartnership = getLastPartnership(secondInnings); //@ts-ignore
  const lastOverData = liveMatchData?.overs?.miniscore?.curOvsStats || '';
  const bowlerName = //@ts-ignore
    liveMatchData?.overs?.miniscore?.bowlerStriker?.name || 'DNA';
  //@ts-ignore
  const getLastSixBalls = matchData => {
    if (typeof matchData !== 'string') {
      console.error('Invalid match data:', matchData);
      return []; // Return an empty array if matchData is not a string
    }

    // Split the match data by ' | ' to get individual phases
    const phases = matchData.split(' | ');

    // Join all phases into one string and split by space
    const allBalls = phases.join(' ').split(' ');

    // Filter out non-numeric values (e.g., "L1", "W", etc.)
    const numericBalls = allBalls.filter(
      ball =>
        ball === '0' ||
        ball === '1' ||
        ball === '2' ||
        ball === '4' ||
        ball === '6' ||
        ball === 'W' ||
        ball === 'N',
    ); // Keep only numbers that represent valid outcomes

    // Get the last 6 ball outcomes
    const lastSix = numericBalls.slice(-6); // Take only the last 6 valid outcomes

    return lastSix;
  };

  // Example live match data (as a string)
  // Get the last six balls data dynamically
  const lastSixBallsData = getLastSixBalls(lastOverData);

  // Display the result
  // console.log(lastOverData);  // Join to display as a string

  // Map over the last six balls and append the corresponding color from lastSixBalls
  const ballsWithColor = lastSixBallsData.map(ball => {
    const ballData = lastSixBalls.find(item => item.value === ball);
    return ballData
      ? {value: ball, color: ballData.color}
      : {value: ball, color: 'black'}; // Default to 'black' if not found
  });

  console.log('firstInningsScore', firstInningsScore);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderWithBackButton
        title={team1.teamSName + ' Vs ' + team2.teamSName}
        onBackButton={() => navigation.goBack()}
      />

      <View style={homeStyle.ContestDetailContainer}>
        {/* TOP View */}
        <View style={[homeStyle.topViewContainer, {height: 160}]}>
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
              <Text style={[homeStyle.bannerText, {color: colors.red}]}>
                {'Live'}
              </Text>
            </View>
          </View>
          {/* Center Banner */}

          {/* Main Content */}

          <View style={homeStyle.mainContentContainer}>
            {/* Left View */}
            <View style={homeStyle.leftContainer}>
              <FastImage
                source={{
                  uri: fristTeamFlag,
                }}
                style={homeStyle.flagImage}
              />
              <Text style={homeStyle.teamName}>{firstInningsTeamShort}</Text>
              <Text style={[homeStyle.teamName, {fontSize: 14, marginTop: 2}]}>
                {firstInningsScore}
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
                  backgroundColor: colors.opacityBlue,
                  position: 'absolute',
                  width: '100%',
                  justifyContent: 'center',
                  bottom: 0,
                  alignItems: 'center',
                  flexDirection: 'row',
                },
              ]}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: !(
                    firstInningsLastPartnership?.length > 0 &&
                    secondInningsLastPartnership?.length > 0
                  )
                    ? 'column'
                    : 'row',
                }}>
                {!(
                  firstInningsLastPartnership?.length > 0 &&
                  secondInningsLastPartnership?.length > 0
                ) ? (
                  firstInningsLastPartnership.map((player, index) => (
                    <PlayerBattingInfo key={index} player={player} />
                  ))
                ) : (
                  <>
                    <Text
                      style={[
                        homeStyle.bannerText,
                        {color: colors.black, fontSize: 12},
                      ]}
                      numberOfLines={1}>
                      {bowlerName.length > 6
                        ? bowlerName.slice(0, 6)
                        : bowlerName}
                    </Text>
                    <LastSixBalls ballsData={ballsWithColor} />
                  </>
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  flexDirection:
                    secondInningsLastPartnership?.length > 0 ? 'column' : 'row',
                }}>
                {firstInningsLastPartnership?.length > 0 &&
                secondInningsLastPartnership?.length > 0 ? (
                  secondInningsLastPartnership.map((player, index) => (
                    <PlayerBattingInfo key={index} player={player} />
                  ))
                ) : (
                  <>
                    <Text
                      style={[
                        homeStyle.bannerText,
                        {color: colors.black, fontSize: 12},
                      ]}
                      numberOfLines={1}>
                      {bowlerName.length > 6
                        ? bowlerName.slice(0, 6)
                        : bowlerName}
                    </Text>
                    <LastSixBalls ballsData={ballsWithColor} />
                  </>
                )}
              </View>
            </View>
            {/* Right View */}
            <View style={homeStyle.rightContainer}>
              <FastImage
                source={{
                  uri: secondTeamFlag,
                }}
                style={homeStyle.flagImage}
              />

              <Text style={[homeStyle.teamName]}>{secondInningsTeamShort}</Text>
              <Text style={[homeStyle.teamName, {fontSize: 14, marginTop: 2}]}>
                {secondInningsScore}
              </Text>
            </View>
          </View>

          {/* Decorative Element */}
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
                (contestsList?.contests?.length || 0) > 1 ? 's' : '' //@ts-ignore
              } (${contestsList?.contests?.length || 0})`}
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
