import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import HeaderWithBackButton from '../../Components/Header/Header';
import {homeStyle} from './styles';
import {colors} from '../../Components/Colors';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {PlayerOnfoModal} from '../Modals/PlayerInfo';

const windowHeight = Dimensions.get('window').height;

interface Player {
  name: string;
  country: string;
  image?: string;
}

interface RouteParams {
  route?: {
    params?: {
      params?: Player[];
      paramsData?: Player[];
    };
  };
}

export default function TeamPreviewScreen(route: RouteParams) {
  const navigation = useNavigation();
  const paramsData: Player[] = route?.route?.params?.params || [];
  const paramsDataTeamInfo: Player[] = route?.route?.params?.paramsData || []; //@ts-ignore
  const team1Data = paramsData ? JSON.parse(paramsDataTeamInfo.team1) : {};//@ts-ignore
  const team2Data = paramsData ? JSON.parse(paramsDataTeamInfo.team2) : {};
  
  const [selectedPlayer, setSelectedPlayer] = useState<{
    player_id: string;
    image: string;
  } | null>(null);
  const defaultImage = `${imageBaseUrl}users/default-user.jpg`; // External URL
  const [profileImageModal, setProfileImageModal] = React.useState(false);
  const getTeamAbbreviation = (teamName: any) => {
    return teamName.toUpperCase().slice(0, 3); // Get first 3 letters and convert to uppercase
  };

  // Get team abbreviations for dynamic comparison
  const team1Abbreviation = getTeamAbbreviation(team1Data.teamSName);
  const team2Abbreviation = getTeamAbbreviation(team2Data.teamSName);

  // Filter players based on their team abbreviation
  const team1Players = paramsData.filter(
    (player: any) =>
      getTeamAbbreviation(player.team_name) === team1Abbreviation,
  );

  const team2Players = paramsData.filter(
    (player: any) =>
      getTeamAbbreviation(player.team_name) === team2Abbreviation,
  );

  // Set the dynamic title based on the countries
  const team1 = team1Players.length > 0 ? team1Data.teamSName : '';
  const team2 = team2Players.length > 0 ? team2Data.teamSName : '';
  const title = team1 && team2 ? `${team1} vs ${team2}` : 'Select Players';

  const categorizedPlayers = paramsData.reduce((categories, player: any) => {
    categories[player.role] = categories[player.role] || [];
    categories[player.role].push(player);
    return categories;
  }, {} as {[key: string]: any[]});

  const playerName = (name: string) => {
    if (name && name.includes(' ')) {
      return name
        .split(' ')
        .map((part: string, index: number) =>
          index === 0 ? `${part[0]}.` : part,
        )
        .join(' ');
    }
    return name;
  };
  const playerType = categorizedPlayers['Batting Allrounder']?.length
    ? 'Batting Allrounder'
    : 'Bowling Allrounder';
  const renderPlayer = (player: any, index: number) => (
    console.log('player', player),
    (
      <TouchableOpacity
        onPress={() => {
          setSelectedPlayer({player_id: player.player_id, image: player.image}); // Ensure 'player' is defined
          setProfileImageModal(true);
        }}
        key={index}
        style={{flexDirection: 'column', width: '25%', padding: 5}}>
        <Image
          source={{
            uri: `${imageBaseUrl + player.image}` || defaultImage,
          }}
          style={{height: 50, width: 50, borderRadius: 25, alignSelf: 'center'}}
        />
        <View
          style={{
            backgroundColor: colors.black,
            borderRadius: 5,
            marginVertical: 5,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              color: colors.white,
              textAlign: 'center',
            }}>
            {playerName(player.name)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  );

  const renderSection = (players: any[], role: any) => {
    // console.log('playersplayers', role); // Log the players for debugging

    return (
      <>
        <View style={{marginVertical: 10}}>
          <Text style={{fontSize: 16, fontWeight: '500'}}>{role}</Text>
        </View>
        <View
          style={[
            styles.flexSection,
            {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
          ]}>
          {players.map(renderPlayer)}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={homeStyle.safeArea}>
      <HeaderWithBackButton
        title={title}
        onBackButton={() => navigation.goBack()}
      />

      <PlayerOnfoModal
        visible={profileImageModal}
        onRequestClose={() => setProfileImageModal(false)}
        playerId={selectedPlayer?.player_id ?? ""}
        playerImage={selectedPlayer?.image ?? ''}
        cancel={() => setProfileImageModal(false)}
      />

      <View style={homeStyle.ContestDetailContainer}>
        {/* Team Info Header */}
        <View style={styles.teamInfoHeader}>
          <View style={homeStyle.rowContainer}>
            {/* Left View */}
            <View style={homeStyle.teamContainer}>
              <View style={homeStyle.teamInfo}>
                <Text style={homeStyle.teamText}>Players</Text>
                <Text style={homeStyle.teamText}>11/11</Text>
              </View>
              <FastImage
                source={{
                  uri: `${imageBaseUrl + team2Data.image}`,
                }}
                style={homeStyle.flagImage}
                resizeMode="stretch"
              />
              <Text style={homeStyle.matchDetailsCon}>{team1}</Text>
              <Text
                style={[
                  homeStyle.matchDetailsCon,
                  homeStyle.matchDetailsMargin,
                ]}>
                {team1Players.length}
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
                {team2Players.length}
              </Text>
              <Text
                style={[
                  homeStyle.matchDetailsCon,
                  homeStyle.matchDetailsMargin,
                ]}>
                {team2}
              </Text>
              <FastImage
                //  uri: `${imageBaseUrl + player.image}` || defaultImage,
                source={{
                  uri: `${imageBaseUrl + team1Data.image}`,
                }}
                style={homeStyle.flagImage}
              />
              <View style={homeStyle.teamInfo}>
                <Text style={homeStyle.teamText}>Credits</Text>
                <Text style={homeStyle.teamText}>{'100'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Height Sections */}
        <ImageBackground
           source={require('../../Assets/match_backgraund.png')}
          >
        <View style={styles.dynamicHeightContainer}>
         

          
          {renderSection(
            categorizedPlayers['WK-Batsman'] || [],
            'WICKET-KEEPERS',
          )}
          {renderSection(categorizedPlayers['Batsman'] || [], 'BATTERS')}
          {renderSection(categorizedPlayers[playerType] || [], 'ALL-ROUNDERS')}
          {renderSection(categorizedPlayers['Bowler'] || [], 'BOWLERS')}
        
        </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamInfoHeader: {
    // height: 50,
    paddingVertical:10,
    backgroundColor: colors.scarletRed,
  },
  dynamicHeightContainer: {
    height: windowHeight,
    alignItems: 'center',
    // backgroundColor: colors.opacityBlue,
    // justifyContent: 'center',
  },
  flexSection: {
    // flex: 1,
  },
});
