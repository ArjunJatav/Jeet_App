import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {colors} from '../../Components/Colors';

import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';

import {homeStyle} from './styles';
import {getMatchPlayersData} from './HomeApiProvider';
import {AntDesign, Octicons} from '../../Components/ReactIcons/ReactIcon';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import BottomButton from '../../Components/Button/BottomButton';
let windowWidth = Dimensions.get('window').width;

export default function CreateTeamScreen(route: any) {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [teamPlayers, setTeamPlayers] = useState({
    team1PlayerList: [],
    team2PlayerList: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPlayers, setSelectedPlayers] = useState(new Map());
  const paramsData = route?.route?.params?.params; // Safely access the params
  const authToken = useSelector((state: RootState) => state.auth.token);

  const safeJsonParse = (jsonString: any) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {}; // Return a default empty object in case of error
    }
  };

  const fetchMatchPlayersData = async () => {
    setLoading(true); // Set loading to true when the fetch starts
    try {
      const data = await getMatchPlayersData(
        authToken ?? '',
        paramsData.cricbuzz_match_id,
      );
      setTeamPlayers({
        team1PlayerList: JSON.parse(data[0].team1_player),
        team2PlayerList: JSON.parse(data[0].team2_player),
      });
    } catch (error) {
      console.error('Data fetch failed:', error);
    } finally {
      setLoading(false); // Set loading to false when the fetch ends, whether success or error
    }
  };

  // Function to divide players based on their role
  const dividePlayersByRole = (teamPlayers: any) => {
    const batsmen: any = [];
    const bowlers: any = [];
    const allrounders: any = [];
    const wicketkeepers: any = [];

    teamPlayers.forEach((player: any) => {
      if (player.role === 'Batsman') {
        batsmen.push(player);
      } else if (player.role === 'Bowler') {
        bowlers.push(player);
      } else if (
        player.role === 'Batting Allrounder' ||
        player.role === 'Bowling Allrounder'
      ) {
        allrounders.push(player);
      } else if (player.role === 'WK-Batsman') {
        wicketkeepers.push(player);
      }
    });

    return {
      batsmen,
      bowlers,
      allrounders,
      wicketkeepers,
    };
  };

  // Example: Applying the function on team1PlayerList
  const dividedPlayers = dividePlayersByRole([
    ...teamPlayers.team1PlayerList,
    ...teamPlayers.team2PlayerList,
  ]);
  //  console.log('teamPlayersteamPlayersteamPlayersteamPlayers', dividedPlayers);

  useEffect(() => {
    setTeamPlayers({
      team1PlayerList: [],
      team2PlayerList: [],
    });
    fetchMatchPlayersData();
  }, []);

  // Safely parse team data
  const teamFristId = paramsData?.team1 ? safeJsonParse(paramsData.team1) : {};
  const teamSecondId = paramsData?.team2 ? safeJsonParse(paramsData.team2) : {};

  const getFilteredPlayers = () => {
    switch (selectedTab) {
      case 0:
        return dividedPlayers.wicketkeepers;
      case 1:
        return dividedPlayers.batsmen;
      case 2:
        return dividedPlayers.allrounders;
      case 3:
        return dividedPlayers.bowlers;
      default:
        return [];
    }
  };

  // Filter players by the target team name
  const team1Players = Array.from(selectedPlayers.values()).filter(
    (player: any) => player.team_name === player.team_name,
  );

  // Combine both teams into one array (for demonstration purposes, only team1Players is used here)
  const allPlayers = [...team1Players];

  // Group players by their roles
  const selectwkPlayers = allPlayers.filter(
    (player: any) => player.role === 'WK-Batsman',
  );
  const selectbatPlayers = allPlayers.filter(
    (player: any) => player.role === 'Batsman',
  );
  const selectarPlayers = allPlayers.filter(
    (player: any) =>
      player.role === 'Batting Allrounder' ||
      player.role === 'Bowling Allrounder',
  );
  const selectbowlPlayers = allPlayers.filter(
    (player: any) => player.role === 'Bowler',
  );

  const teams = [teamFristId.teamSName, teamSecondId.teamSName]; // Add all team names here dynamically
  // Function to get team abbreviation (first 3 letters in uppercase)
  const getTeamAbbreviation = (teamName: any) => {
    return teamName.toUpperCase().slice(0, 3); // Get first 3 letters and convert to uppercase
  };

  // Updated player count logic that uses abbreviations dynamically
  const playerCountByTeam = teams.reduce((acc, team) => {
    // Get the team abbreviation (first 3 letters of the team name)
    const teamAbbreviation = getTeamAbbreviation(team);

    // Filter players based on the team abbreviation
    const teamPlayers = allPlayers.filter(
      player => getTeamAbbreviation(player.team_name) === teamAbbreviation,
    );

    // Set the count for this team abbreviation
    acc[teamAbbreviation] = teamPlayers.length;

    return acc;
  }, {});

  // console.log('Player count by team:', playerCountByTeam);
  // console.log('selectedPlayers >>>>> ', selectedPlayers);
  // console.log('teams', playerCountByTeam);

  const handlePlayerSelect = (player: any) => {
    // console.log('player', player);

    //@ts-ignore
    const updatedSelectedPlayers = new Map(selectedPlayers);
    const teamPlayers = Array.from(updatedSelectedPlayers.values()).filter(
      (p: any) => p.team_name === player.team_name,
    );

    // Create a unique key using player name and country
    const playerKey = `${player.name}-${player.team_name}`;

    if (updatedSelectedPlayers.has(playerKey)) {
      // If selected, remove the player from the map
      updatedSelectedPlayers.delete(playerKey);
    } else {
      // Check if the total selected players are less than 11
      if (updatedSelectedPlayers.size >= 11) {
        Alert.alert(
          'Player Limit Reached',
          'You can select only up to 11 players in total.',
          [{text: 'OK'}],
          {cancelable: false},
        );
        return; // Prevent further selection
      }

      if (teamPlayers.length >= 10) {
        Alert.alert(
          'Team Limit Reached',
          'You can select only up to 10 players from a single team.',
          [{text: 'OK'}],
          {cancelable: false},
        );
        return; // Prevent further selection
      }

      updatedSelectedPlayers.set(playerKey, {
        name: player.name,
        team_name: player.team_name,
        image: player.face_image,
        bench: player.bench,
        role: player.role,
        player_id: player.player_id,
      });
    }

    //@ts-ignore
    setSelectedPlayers(updatedSelectedPlayers);
  };

  const renderPlayerList = (players: any[]) => {
    // Filter players into announced and not announced
    const announcedPlayers = players.filter(player => player.bench == 0);
    const notAnnouncedPlayers = players.filter(player => player.bench == 1);

    const defaultImage = `${imageBaseUrl}users/default-user.jpg`; // External URL
    const renderSection = (title: string, playerList: any[]) => (
      console.log(playerList, 'playerList'),
      (
        <>
          {/* Section Title */}
          <View
            style={{
              height: 20,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 0.5,
              borderColor: colors.modalOpacity,
            }}>
            <Text
              style={{
                height: 20,
                width: 120,
                textAlign: 'center',
                color: title !== 'Announced' ? 'red' : 'green',
                backgroundColor: title !== 'Announced' ? '#e9a9ab' : '#b7dac2', // Optional section header background
              }}>
              {title}
            </Text>
          </View>

          {playerList.map(player => {
            const playerKey = `${player.name}-${player.team_name}`; // Use unique key here

            return (
              <TouchableOpacity
                onPress={() => {
                  handlePlayerSelect(player);
                }} // Use player object to select
                key={playerKey}
                style={{
                  height: 80,
                  backgroundColor: selectedPlayers.has(playerKey)
                    ?colors.lightScarletRed
                    : colors.white, // Change color when selected
                  borderBottomWidth: 0.5,
                  borderColor: colors.modalOpacity,
                  justifyContent: 'center',
                  width: windowWidth,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <FastImage
                      source={{
                        uri:
                          `${imageBaseUrl + player.face_image}` || defaultImage,
                      }}
                      style={{width: 50, height: 50, borderRadius: 25}}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: colors.scarletRed,
                        bottom: -10,
                        borderRadius: 3,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.white,
                          fontWeight: '500',
                          padding: 2,
                          // marginLeft: 10,
                        }}>
                        {player?.team_name
                          ? player?.team_name?.length > 3
                            ? player?.team_name.slice(0, 3).toUpperCase()
                            : player?.team_name.toUpperCase()
                          : 'DNA'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black,
                      fontWeight: '600',
                      marginLeft: 10,
                    }}>
                    {player.name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: colors.black}}>
                    {player.points ?? ''}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.black,
                      fontWeight: '600',
                    }}>
                    {player.credits}
                  </Text>
                  <Octicons
                    name={
                      selectedPlayers.has(playerKey)
                        ? 'no-entry'
                        : 'plus-circle'
                    }
                    size={18}
                    color={
                      selectedPlayers.has(playerKey) ? 'red' : colors.black
                    }
                    style={{
                      height: 18,
                      width: 18,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )
    );

    return (
      <View>
        {/* Render Announced Players Section */}
        {announcedPlayers.length > 0
          ? renderSection('Announced', announcedPlayers)
          : null}

        {/* Render Not Announced Players Section */}
        {notAnnouncedPlayers.length > 0
          ? renderSection('Unannounced', notAnnouncedPlayers)
          : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={homeStyle.safeArea}>
      <HeaderWithBackButton
        title="Create a Team"
        onBackButton={() => navigation.goBack()}
      />
      <View style={homeStyle.ContestDetailContainer}>
        <View style={homeStyle.topView}>
          <View style={homeStyle.topInnerView}>
            <Text style={homeStyle.maxPlayersText}>
              Maximum of 10 Players From One Team
            </Text>
          </View>
          <View style={homeStyle.rowContainer}>
            {/* Left View */}
            <View style={homeStyle.teamContainer}>
              <View style={homeStyle.teamInfo}>
              <Text style={[homeStyle.teamText,{ fontWeight:"600"}]}>Players</Text>
                <Text style={homeStyle.teamText}>
                  {selectedPlayers.size}/11
                </Text>
              </View>
              <FastImage
                source={{
                  uri: imageBaseUrl + teamFristId.image,
                }}
                style={homeStyle.flagImage}
                resizeMode="stretch"
              />
              <Text style={homeStyle.matchDetailsCon}>
                {teamFristId.teamSName}
              </Text>
              <Text
                style={[
                  homeStyle.matchDetailsCon,
                  homeStyle.matchDetailsMargin,
                ]}>
                {playerCountByTeam[teams[0]]}
              </Text>
            </View>

            {/* Center View */}
            <View style={homeStyle.centerView}>
              <View style={homeStyle.divider} />
            </View>

            {/* Right View */}
            <View style={homeStyle.teamContainer}>
              <Text
                style={[
                  homeStyle.matchDetailsCon,
                  homeStyle.matchDetailsMargin,
                ]}>
                {playerCountByTeam[teams[1]]}
              </Text>
              <Text
                style={[
                  homeStyle.matchDetailsCon,
                  homeStyle.matchDetailsMargin,
                ]}>
                {teamSecondId.teamSName}
              </Text>
              <FastImage
                source={{
                  uri: imageBaseUrl + teamSecondId.image,
                }}
                style={homeStyle.flagImage}
              />
              <View style={homeStyle.teamInfo}>
                <Text style={[homeStyle.teamText,{ fontWeight:"600"}]}>Credits</Text>
                <Text style={homeStyle.teamText}>
                  {'100'}
                  {/* {totalCredits.toFixed(2) ?? '100'} */}
                </Text>
              </View>
            </View>
          </View>

          {/* Player Selection View */}
          <View style={homeStyle.playerSelectionContainer}>
            <View style={{padding:2,paddingHorizontal:5, backgroundColor:colors.white,flexDirection:"row", borderRadius:10}}>

           
            {Array.from({length: 11}).map((_, index) => (
              <View
                key={index}
                style={[
                  homeStyle.playerBox,
                  {
                    backgroundColor:
                      index > selectedPlayers.size - 1
                        ? colors.spotScarletRed
                        : colors.scarletRed,
                  },
                ]}
              />
            ))}
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
            onPress={() => setSelectedTab(0)}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 0 && homeStyle.selectedTabText,
              ]}>
              {/* WK({selectwkPlayers.length}) */}
              {selectwkPlayers.length > 0
                ? `WK (${selectwkPlayers.length})`
                : 'WK'}
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 1 && homeStyle.selectedTabButton,
            ]}
            onPress={() => setSelectedTab(1)}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 1 && homeStyle.selectedTabText,
              ]}>
              {selectbatPlayers.length > 0
                ? `BAT (${selectbatPlayers.length})`
                : 'BAT'}
            </Text>
          </TouchableOpacity>

          {/* Tab 3 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 2 && homeStyle.selectedTabButton,
            ]}
            onPress={() => setSelectedTab(2)}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 2 && homeStyle.selectedTabText,
              ]}>
              {/* AR({selectarPlayers.length}) */}
              {selectarPlayers.length > 0
                ? `AR (${selectarPlayers.length})`
                : 'AR'}
            </Text>
          </TouchableOpacity>

          {/* Tab 4 */}
          <TouchableOpacity
            style={[
              homeStyle.tabButton,
              selectedTab === 3 && homeStyle.selectedTabButton,
            ]}
            onPress={() => setSelectedTab(3)}>
            <Text
              style={[
                homeStyle.tabText,
                selectedTab === 3 && homeStyle.selectedTabText,
              ]}>
              {/* BOWL({selectbowlPlayers.length}) */}
              {selectbowlPlayers.length > 0
                ? `BOWL (${selectbowlPlayers.length})`
                : 'BOWL'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            homeStyle.headerContainer,
            {
              backgroundColor: colors.white,
              borderBottomColor: colors.modalOpacity,
            },
          ]}>
          {/* Tab 1 */}
          <TouchableOpacity style={homeStyle.tabSelectedBy}>
            <Text style={[homeStyle.tabText, {color: colors.black}]}>
              Selected By
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity style={homeStyle.tabPoints}>
            <Text style={[homeStyle.tabText, {color: colors.black,}]}>
              Points
            </Text>
          </TouchableOpacity>

          {/* Tab 3 */}
          <TouchableOpacity style={homeStyle.tabCredits}>
            <Text style={[homeStyle.tabText, {color: colors.black}]}>
              Credits
            </Text>
            <AntDesign
              name={'arrowdown'}
              size={14}
              color={colors.black}
              style={homeStyle.icon}
            />
          </TouchableOpacity>
        </View>

        {/* PagerView for Tab Content */}

        {!loading ? (
          <>
            <PagerView
              style={{flex: 1}}
              initialPage={selectedTab}
              onPageSelected={e => setSelectedTab(e.nativeEvent.position)}>
              <View
                key="1"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ScrollView contentContainerStyle={{paddingBottom: 200}}>
                  {renderPlayerList(getFilteredPlayers())}
                </ScrollView>
              </View>
              <View
                key="2"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ScrollView contentContainerStyle={{paddingBottom: 200}}>
                  {renderPlayerList(getFilteredPlayers())}
                </ScrollView>
              </View>
              <View
                key="3"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ScrollView contentContainerStyle={{paddingBottom: 200}}>
                  {renderPlayerList(getFilteredPlayers())}
                </ScrollView>
              </View>
              <View
                key="4"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ScrollView contentContainerStyle={{paddingBottom: 200}}>
                  {renderPlayerList(getFilteredPlayers())}
                </ScrollView>
              </View>
            </PagerView>
          </>
        ) : (
          // This is the fallback content when loading is false
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.scarletRed} />
          </View>
        )}
      </View>
      {allPlayers.length >= 11 && (
        <BottomButton
        leftButton={{
          title: 'Preview',
          icon: 'eye',
          onPress :() => {
            //@ts-ignore
            navigation.navigate('TeamPreviewScreen', {
              params: allPlayers,
              paramsData: paramsData,
              fromButton: 'joinContest',
            })
          },
        }}
        rightButton={{
          title: 'Next',
          icon: 'arrow-right',
          onPress : () => {
            //@ts-ignore
            navigation.navigate('SelectCaptainScreen', {
              params: allPlayers,
              paramsData: paramsData,
              fromButton: 'joinContest',
            })}}
        }
      />

        
      )}
    </SafeAreaView>
  );
}
