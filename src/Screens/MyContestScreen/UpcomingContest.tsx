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
import {getContestTeam, myContestList} from './MyContestApiProvide';
import {Entypo, Octicons} from '../../Components/ReactIcons/ReactIcon';
import {LOCALTEXT} from '../../Language/AllTextProvider';
interface Contest {
  data: any;
}
let windowWidth = Dimensions.get('window').width;

export default function UpcommingContest(route: any) {
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
  // console.log('paramsDataResponse', paramsData);


  // *** *** Function for fetching ContestData & TeamData ***  *** //
  const fetchContests = useCallback(() => {
    if (!matchID) return;

    // *** *** API call for ContestList and TeamData ***  *** //
    const fetchData = async () => {
      try {
        const contestResponse = await myContestList(
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
        // console.log("teamResponse",teamResponse);

        // setTeamData(teamResponse);
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

  //   *** *** ContestList View ***  *** //
  const MatchesList = () => {
    return (
      <View style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.scarletRed}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          />
        ) : (
          <FlatList
            data={selectedTab === 0 ? contestsList : teamData}
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
    console.log('matchmatchmatchwww', match);

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

    if (match?.contests?.sports_left > 0) {
      const totalWidth = 100;

      joiningWirth = (match?.contests?.sports_left / match?.contests?.allowed_team) * totalWidth;
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
                <Text style={[homeStyle.matchTitle,{color:colors.scarletRed}]} numberOfLines={1}>
                  {match.series.name}
                </Text>

                <View
                  style={{
                    backgroundColor: '#f5f9fa',
                    padding: 5,
                    marginTop: 5,
                    borderRadius: 5,
                  }}>
                  <View style={[homeStyle.cardRow, {marginVertical: 0}]}>
                    <Text
                      style={
                        homeStyle.matchSpots
                      }>{`Spots Left: ${match.contests.sports_left}`}</Text>
                    <Text
                      style={
                        homeStyle.matchSpots
                      }>{`Total Spots: ${match.contests.allowed_team}`}</Text>
                  </View>

                  <View
                    style={[
                      homeStyle.progressBarContainer,
                      {marginVertical: 5},
                    ]}>
                    <View
                      style={[
                        homeStyle.progressBarFill,

                        {width: `${joiningLeftWidth}%`}, // Assuming joiningLeftWidth is },
                      ]}
                    />
                    <View
                      style={[
                        homeStyle.progressBarEmpty,
                        {
                          width: `${joiningWirth}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#f5f9fa',
                  height: 35,
                  // marginTop: 10,
                  borderBottomStartRadius: 10,
                  borderBottomEndRadius: 10,
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color:colors.scarletRed
                  }}
                  numberOfLines={1}>
                  Joined With {match.user_teams.team_name}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View
              style={[
                homeStyle.matchCardForContest,
                {width: windowWidth - 20, height:180},
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

                    <Text style={[homeStyle.matchTitle, {marginTop: 0,color :colors.scarletRed,}]}>
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
                      {flexDirection: 'row', justifyContent: 'center',  borderTopWidth: 1,
                                                                      borderTopColor: colors.newGray,},
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderWithBackButton
          title={team1.teamSName + ' Vs ' + team2.teamSName}

        onBackButton={() => navigation.goBack()}
      />

      <View style={homeStyle.ContestDetailContainer}>



        {/* TOP View */}
        <View style={homeStyle.topViewContainer}>
          {/* Center Banner */}
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
                        <Text style={[homeStyle.bannerText, {color: colors.black}]}>
                          {paramsData.day}
                        </Text>
                      </View>
                    </View>
    

          {/* Main Content */}
          <View style={homeStyle.mainContentContainer}>
            {/* Left View */}
            <View style={homeStyle.leftContainer}>
              <FastImage
                source={{
                  uri: imageBaseUrl + team1.image,
                }}
                style={homeStyle.flagImage}
              />
              <Text style={homeStyle.teamName}>{team1.teamSName}</Text>
            </View>

            {/* VS View */}
            <View style={homeStyle.vsContainer}>
              <View style={homeStyle.vsBadge}>
                <Text style={homeStyle.vsText}>{'VS'}</Text>
              </View>
            </View>

            {/* Right View */}
            <View style={homeStyle.rightContainer}>
             
              <FastImage
                source={{
                  uri: imageBaseUrl + team2.image,
                }}
                style={homeStyle.flagImage}
              />
               <Text style={[homeStyle.teamName, homeStyle.rightTeamName]}>
                {team2.teamSName}
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
              {`My Contest${contestsList.length > 1 ? 's' : ''} (${
                contestsList.length
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
