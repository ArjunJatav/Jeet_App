import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Entypo} from '../../Components/ReactIcons/ReactIcon';
import {commonModalStyle} from './styles';
import {colors} from '../../Components/Colors';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {getPlayerInfoApi} from '../HomeScreen/HomeApiProvider';
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const PlayerOnfoModal = (props?: any) => {
  const [playerInfoData, setPlayerInfoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state: RootState) => state.auth.token);

  console.log('propspropspropsprops', props);

  useEffect(() => {
    if (props.playerId) {
      fetchPlayerInfo();
    }
  }, [, props.playerId]);

  const fetchPlayerInfo = async () => {
    setLoading(true);
    try {
      const data = await getPlayerInfoApi(authToken ?? '', props.playerId);
      setPlayerInfoData(data);
    } catch (error) {
      console.error('Error fetching player info:', error);
    }
    setLoading(false);
  };
  const rankings = playerInfoData?.rankings; // Assuming you're working with the first player

  const renderRankings = (category: any, type: any) => {
    // console.log('category', category[type]);

    if (!category || !category[type]) {
      return (
        <Text style={[commonModalStyle.playerInfo, {color: colors.black}]}>
          -
        </Text>
      );
    }
    return (
      <Text style={[commonModalStyle.playerInfo, {color: colors.black}]}>
        {category[type]}
      </Text>
    );
  };

  const InfoRow = ({label, value}: any) => (
    <View
      style={{flexDirection: 'row', marginHorizontal: 10, marginVertical: 8}}>
      <View style={{flex: 0.5}}>
        <Text
          style={[
            commonModalStyle.playerInfo,
            {color: colors.black, fontWeight: 'bold'},
          ]}>
          {label}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={{color: colors.black, fontSize: 12}}>{value || '-'}</Text>
      </View>
    </View>
  );

  const RankingRow = ({title, ranking}: any) => (
    <View style={commonModalStyle.rankingRow}>
      <View style={{flex: 1}}>
        <Text style={[commonModalStyle.playerInfo, commonModalStyle.boldText]}>
          {title}
        </Text>
      </View>
      <View style={{flex: 1}}>{renderRankings(ranking, 'testBestRank')}</View>
      <View style={{flex: 1}}>{renderRankings(ranking, 'odiBestRank')}</View>
      <View style={{flex: 1}}>{renderRankings(ranking, 't20BestRank')}</View>
    </View>
  );

  return (
    <Modal
      style={commonModalStyle.modal}
      animationType="slide"
      visible={props.visible}
      transparent={true}
      onRequestClose={() => {
        props.onRequestClose;
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={[
            commonModalStyle.modal_view,
            {
              //   height: windowHeight - 100,
              alignItems: 'center',
              backgroundColor: '#ECF2FF',
              //   padding:20
            },
          ]}>
          <View style={commonModalStyle.header}>
            <View style={commonModalStyle.profileContainer}>
              <Image
                source={{
                  uri: `${imageBaseUrl + props.playerImage}`,
                }}
                style={commonModalStyle.playerImage}
              />
              <View style={commonModalStyle.playerDetails}>
                <Text style={commonModalStyle.playerName} numberOfLines={1}>
                  {playerInfoData?.name ?? ''}
                </Text>
                <Text style={commonModalStyle.playerRole} numberOfLines={1}>
                  {playerInfoData?.role ?? ''}
                </Text>
                <Text style={commonModalStyle.playerInfo} numberOfLines={1}>
                  Team : {playerInfoData?.intlTeam ?? ''}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={commonModalStyle.cancel_button}
              onPress={props.cancel}>
              <Entypo
                name="cross"
                size={20}
                color={colors.darkBlue}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                marginTop: 10,
                borderRadius: 10,
                width: windowWidth - 30,
                backgroundColor: colors.white,
              },
            ]}>
            <View style={commonModalStyle.playerDetails}>
              <View style={commonModalStyle.headerContainer}>
                <Text
                  style={[commonModalStyle.playerName, {color: colors.black}]}
                  numberOfLines={1}>
                  Personal Information
                </Text>
              </View>

              {[
                {label: 'Born', value: playerInfoData?.DoB},
                {label: 'Birth Place', value: playerInfoData?.birthPlace},
                {label: 'Nick Name', value: playerInfoData?.nickName},
                {label: 'Role', value: playerInfoData?.role},
                {label: 'Batting Style', value: playerInfoData?.bat},
                {label: 'Bowling Style', value: playerInfoData?.bowl},
              ].map((item, index) => (
                <InfoRow key={index} label={item.label} value={item.value} />
              ))}
            </View>
          </View>

          <View
            style={[
              {
                marginTop: 10,
                borderRadius: 10,
                width: windowWidth - 30,
                backgroundColor: colors.white,
              },
            ]}>
            <View style={commonModalStyle.playerDetails}>
              {/* Header */}
              <View style={commonModalStyle.headerContainer}>
                <Text
                  style={[commonModalStyle.playerName, {color: colors.black}]}>
                  ICC Ranking
                </Text>
              </View>

              {/* Ranking Table */}
              <View style={{padding: 10}}>
                {/* Table Header */}
                <View style={commonModalStyle.rankingRow}>
                  <View style={{flex: 1}} />
                  <View style={{flex: 1}}>
                    <Text style={commonModalStyle.boldText}>Test</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={commonModalStyle.boldText}>ODI</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={commonModalStyle.boldText}>T20</Text>
                  </View>
                </View>

                {/* Batting Rankings */}

                <RankingRow title="Bat" ranking={rankings?.bat} />

                {/* Bowling Rankings */}
                <RankingRow title="Bowl" ranking={rankings?.bowl} />

                {/* All-Rounder Rankings */}
                <RankingRow title="All-Round" ranking={rankings?.all} />
              </View>
            </View>
          </View>

          <View style={[commonModalStyle.sectionContainer, {marginBottom: 10}]}>
            <View style={commonModalStyle.playerDetails}>
              <View style={commonModalStyle.sectionHeader}>
                <Text
                  style={[
                    commonModalStyle.playerName,
                    commonModalStyle.sectionHeaderText,
                  ]}
                  numberOfLines={1}>
                  Teams
                </Text>
              </View>
              <Text style={[commonModalStyle.teamsText]}>
                {playerInfoData?.teams}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
