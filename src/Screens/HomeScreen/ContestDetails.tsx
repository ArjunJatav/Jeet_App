import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import FastImage from 'react-native-fast-image';
import {homeStyle} from './styles';
import {getContestTeam, joinContest, matchContestList} from './HomeApiProvider';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {HomeParamList} from './navigation-types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PagerView from 'react-native-pager-view';
import {Entypo, Octicons} from '../../Components/ReactIcons/ReactIcon';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {LOCALTEXT} from '../../Language/AllTextProvider';
import {CustomAlert} from '../../Components/Alert/CustomAlert';
import BottomButton from '../../Components/Button/BottomButton';
let windowWidth = Dimensions.get('window').width;
type CreateTeamScreenNavigationProp = NativeStackNavigationProp<
  HomeParamList,
  'CreateTeamScreen'
>;
interface Contest {
  data: any;
}
export default function ContestDetails(route: any) {
  const navigation = useNavigation<CreateTeamScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [selectedTab, setSelectedTab] = useState(0);
  const reduceUserProfileData = useSelector(
    (state: RootState) => state.profile.data,
  );
  const [joincontestSatate, setJoincontestSatate] = useState(false);
  const [selectedTeam, setTeamSelected] = useState(null);
  const [selectedContestID, setSelectedContestID] = useState<Contest[]>([]);
  const [contestsList, setContestsList] = useState<Contest[]>([]);
  const [teamData, setTeamData] = useState<Contest[]>([]);
  const matchID = route?.route?.params?.params?.id;
  const paramsData = route?.route?.params?.params;
  const team1 = paramsData ? JSON.parse(paramsData.team1) : {};
  const team2 = paramsData ? JSON.parse(paramsData.team2) : {};
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    numberOfButtons: 1,
  });

  // *** *** Function for fetching ContestData & TeamData ***  *** //
  const fetchContests = useCallback(() => {
    if (!matchID) return;

    // *** *** API call for ContestList and TeamData ***  *** //
    const fetchData = async () => {
      try {
        const contestResponse = await matchContestList(
          authToken ?? '',
          matchID.toString(),
        );
        setContestsList(contestResponse.data.contests);

        const teamResponse = await getContestTeam(
          authToken ?? '',
          matchID.toString(),
        );
        const parsedData = teamResponse.map((team: any) => ({
          ...team,
          team_data: JSON.parse(team.team_data),
        }));
        setTeamData(parsedData);
      } catch (error: any) {
        console.error(error.message || 'An error occurred');
      } finally {
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

  const toggleTeamSelection = (index: any) => {
    setTeamSelected((prev: any) => (prev === index ? null : index));
  };
  //   *** *** funcation for joinContest ***  *** //
  const methodJoinContest = useCallback(
    async (joinIteams: any) => {
      let contestJoinData = {
        user_id: joinIteams?.user_id, //@ts-expect-error
        contest_id: selectedContestID?.id,
        matches_id: joinIteams?.matches_id,
        series_id: joinIteams?.series_id,
        user_team_id: joinIteams?.id,
        payment_method: 'upi', //@ts-expect-error
        amount: selectedContestID?.entry_fess,
        transaction_status: 'Completed',
      };

      // *** *** method for calling Joincontest API ***  *** //
      try {
        const response = await joinContest(contestJoinData, authToken ?? '');

        // console.log('responseresponse', response);

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
    [authToken, selectedContestID, navigation],
  );
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
    // console.log('matchmatchmatch', match);

    const isTeamDataEmpty = !match.team_data || match.team_data.length === 0;
    let captain = null;
    let viceCaptain = null;
    let batterCount = 0;
    let wicketkeeperCount = 0;
    let allRounderCount = 0;
    let bowlerCount = 0;
    if (!isTeamDataEmpty) {
      // Find the captain and vice-captain if team data exists
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
    // Create the dynamic rolesData array using the calculated counts
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
      const totalWidth = 100; // Assuming the total progress bar width is 100%

      // Calculate joiningWirth based on allowed teams and sports left
      joiningWirth = (match.sports_left / match.allowed_team) * totalWidth;

      // Calculate joiningLeftWidth as remaining width
      joiningLeftWidth = totalWidth - joiningWirth;
    }

    // console.log('joiningWirthjoiningWirthjoiningWirth', joiningWirth);

    return (
      <>
        {isTeamDataEmpty ? (
          <View
            style={[homeStyle.matchCardForContest, {width: windowWidth - 20, height: 215,}]}>
            <View style={homeStyle.cardContent}>
              <View style={homeStyle.cardLeft}>
                <Text style={homeStyle.matchTitle} numberOfLines={1}>
                  {match.series.name}
                </Text>
                <Text style={[homeStyle.matchSubtitle, {marginVertical: 2}]}>
                  {'Get ready for mega winnings!'}
                </Text>
                <View style={homeStyle.cardRow}>
                  <Text style={[homeStyle.matchDetail, {fontWeight: '600'}]}>
                    {'Total Winnings'}
                  </Text>
                  <Text style={homeStyle.matchDetail}>{'Winners'}</Text>
                </View>
                <View style={homeStyle.cardRow}>
                  <Text
                    style={[
                      homeStyle.matchHighlight,
                      {fontSize: 18, fontWeight: 'bold'},
                    ]}>
                    {LOCALTEXT.CURRENCY_SYMBOL + match.contest_price}
                  </Text>
                  <Text
                    style={[
                      homeStyle.matchHighlight,
                      {fontSize: 15, fontWeight: 'bold'},
                    ]}>
                    {match.contest_prices_count}
                  </Text>
                </View>
                <View style={homeStyle.progressBarContainer}>
                  <View
                    style={[
                      homeStyle.progressBarFill,
                      {width: `${joiningLeftWidth}%`},
                    ]}
                  />
                  <View
                    style={[
                      homeStyle.progressBarEmpty,
                      {width: `${joiningWirth}%`},
                    ]}
                  />
                </View>
                <View style={homeStyle.cardRow}>
                  <Text
                    style={
                      homeStyle.matchSpots
                    }>{`${match.sports_left} Spots Left`}</Text>
                  <Text
                    style={
                      homeStyle.matchSpots
                    }>{`${match.allowed_team} Teams`}</Text>
                </View>
                <View
                  style={[
                    homeStyle.cardRow,
                    {
                      marginVertical: 10,
                      borderTopWidth: 1,
                      borderTopColor: colors.newGray,
                    },
                  ]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={[
                        homeStyle.entryFeeAmount,
                        {fontSize: 12, color: colors.modalOpacity},
                      ]}>
                      {'Entry Fee'}
                    </Text>
                    <Text
                      style={[
                        homeStyle.entryFeeAmount,
                        {fontSize: 16, fontWeight: '600'},
                      ]}>
                      {LOCALTEXT.CURRENCY_SYMBOL + match.entry_fess}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={homeStyle.joinButton}
                    onPress={() => {
                      // console.log("reduceUserProfileDatareduceUserProfileData",reduceUserProfileData?.current_balance);

                      if (
                        reduceUserProfileData?.current_balance >=
                        match.entry_fess
                      ) {
                        if (teamData.length > 0) {
                          setSelectedContestID(match);
                          // methodJoinContest(match);
                          setJoincontestSatate(true);
                          setSelectedTab(1);
                        } else {
                          // console.log("joinContestjoinContest",match.entry_fess);
                          let ENTRYFEES = match.entry_fess;
                          navigation.navigate('CreateTeamScreen', {
                            params: {
                              ...paramsData, // Spread the existing parameters
                              entryFees: ENTRYFEES, // Add entry_fees to the parameters
                            },
                            fromButton: 'joinContest',
                          });
                        }
                      } else {
                        setAlertConfig({
                          ...alertConfig,
                          visible: true,
                          type: 'error',
                          title: 'Low balance!',
                          message:
                            'You do not have enough balance to join this contest',
                        });
                      }
                    }}>
                    <Text style={[homeStyle.joinButtonText, {padding: 0}]}>
                      {'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
         
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
                  {joincontestSatate && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => toggleTeamSelection(teamIndex)}>
                      <View
                        style={{
                          height: 25,
                          width: 25,
                          borderWidth: 2,
                          borderColor: colors.white,
                          // backgroundColor: teamSelected ? colors.darkBlue : colors.white,
                          borderRadius: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginLeft: 10, // Add spacing between content and checkbox
                        }}>
                        {selectedTeam === teamIndex && (
                          <Entypo name="check" size={15} color={colors.white} />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  <Text
                    style={[
                      homeStyle.matchTitle,
                      {color: colors.white, marginTop: 0},
                    ]}>{`Team ${teamIndex + 1 || 1}`}</Text>
                  {selectedTeam === teamIndex && (
                    <TouchableOpacity
                      onPress={() => {
                        methodJoinContest(match);
                      }}
                      style={[
                        homeStyle.joinButton,
                        {
                          borderColor: colors.white,
                          backgroundColor: colors.white,
                          height: 30,
                          marginTop: 0,
                          justifyContent: 'center',
                          borderRadius: 8,
                        },
                      ]}>
                      <Text style={[homeStyle.matchTitle, {marginTop: 0}]}>
                        {'Join'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{flex: 1}}>
                  <View style={homeStyle.teamcaptaionVc}>
                    <Text
                      style={[
                        homeStyle.matchTitle,
                        {color: colors.scarletRed, marginTop: 10},
                      ]}>
                      {captain.name}(C)
                    </Text>

                    <Text
                      style={[
                        homeStyle.matchTitle,
                        {color: colors.scarletRed, marginTop: 10},
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
                      // console.log("matchmatch",match.team_data);
                      navigation.navigate('TeamPreviewScreen', {
                        params: match.team_data, //@ts-ignore
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderWithBackButton
        title="CONTESTS"
        onBackButton={() => navigation.goBack()}
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
          navigation.push('BottomTab', {screen: 'HomeRoute'});
          setAlertConfig(prev => ({...prev, visible: false})); // Corrected semicolon
        }}
        onCancel={() => setAlertConfig(prev => ({...prev, visible: false}))}
      />
      <View style={homeStyle.ContestDetailContainer}>
        {/* TOP View */}
        <View style={homeStyle.topViewContainer}>
          {/* Center Banner */}
          <View style={homeStyle.bannerContainer}>
            <View style={homeStyle.bannerContent}>
              <Text style={homeStyle.bannerText}>{paramsData.day}</Text>
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

          {/* Decorative Element */}
          {/* <View style={homeStyle.decorativeBar}></View> */}
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
              setSelectedTab(0),
                setJoincontestSatate(false),
                setTeamSelected(null);
            }}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 0 && homeStyle.selectedTabText,
                {fontWeight: '600'},
              ]}>
              Contest({contestsList.length})
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 1 && homeStyle.selectedTabButton,
            ]}
            onPress={() => {
              setSelectedTab(1),
                setJoincontestSatate(false),
                setTeamSelected(null);
            }}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 1 && homeStyle.selectedTabText,
                {fontWeight: '600'},
              ]}>
              Teams({teamData.length})
            </Text>
          </TouchableOpacity>
        </View>

        <PagerView
          style={{flex: 1}}
          initialPage={selectedTab}
          onPageSelected={e => {
            setSelectedTab(e.nativeEvent.position),
              setJoincontestSatate(false),
              setTeamSelected(null);
          }}>
          <MatchesList />
          <MatchesList />
        </PagerView>
      </View>
 

      <BottomButton
        title="Create a Team"
        onPress={() =>{
          navigation.navigate('CreateTeamScreen', {
            params: paramsData,
            fromButton: 'createTeam',
          })
        }
        }
      />
    
    </SafeAreaView>
  );
}
