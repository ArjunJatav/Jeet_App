import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {accountStyle} from './styles';
import HeaderWithBackButton from '../../Components/Header/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../Redux/store';
import {colors} from '../../Components/Colors';
import {getCompleteMatchApi} from './ApiProvider';
import {FontAwesome} from '../../Components/ReactIcons/ReactIcon';
import {imageBaseUrl} from '../../ConstantFiles/Api';
import FastImage from 'react-native-fast-image';

let windowWidth = Dimensions.get('window').width;

export default function AllCompleteMatch() {
  const navigation = useNavigation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [matchData, setMatchData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transaction history
  const getCompleteMatchMethod = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCompleteMatchApi(authToken ?? ''); // Pass filters here
      if (response?.data) {
        setMatchData(response.data);
      } else {
        console.warn('Response data is empty or undefined.');
      }
    } catch (error: any) {
      console.log(
        'Error fetching transaction history:',
        error?.message || error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      getCompleteMatchMethod();
    }
  }, [authToken]);

  
  

  const renderMatchItem = ({item, index}: any) => {
    const team1name = item?.team1
    ? JSON.parse(item?.team1)
    : {};
    const team2name = item?.team2
    ? JSON.parse(item?.team2)
    : {};
  
    // console.log("matchDatamatchDatamatchData",item);
    return (
      <View style={[accountStyle.transactionItem, {height: 200}]}>
        {/* Header Section */}
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8,
            marginTop: 8,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent:"space-between",
              // gap: 5,
              alignItems: 'center',
            }}>
            <FastImage
              source={{
                uri: imageBaseUrl + team1name.image,
              }}
              style={{height: 55, width: 55, borderRadius: 5}}
            />
            <Text style={[accountStyle.statText, {color: colors.black,fontWeight:"500"}]}>
             {team1name.teamSName}
            </Text>
            <Text style={accountStyle.statText}>Vs</Text>
            <Text style={[accountStyle.statText, {color: colors.black, fontWeight:"500"}]}>
             {team2name.teamSName}
            </Text>
            <FastImage
              source={{
                uri: imageBaseUrl + team2name.image,
              }}
              style={{height: 55, width: 55, borderRadius: 5}}
            />
          </View>
          {/*  */}
        </View>
        <View
          style={{
            height: 25,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:colors.screen_bg,
            paddingHorizontal: 8,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={[accountStyle.statText,{fontWeight:"400", color:colors.black}]} numberOfLines={1}>{item.status}</Text>
          </View>
          <View
            style={{
              flex: 0.5,
              //   width: 80,
              //   backgroundColor: colors.opacityBlue,
              //   height: 30,
              //   borderRadius:15,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text numberOfLines={1} style={[accountStyle.statText,{color:colors.scarletRed, fontWeight:"600"}]}>{item.day}</Text>
          </View>
        </View>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            // marginHorizontal: 8,
            backgroundColor:colors.white,
            marginTop: 5,
          }}>
          <View
            style={{
              // height: 15,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              // backgroundColor:"red"
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
              <Text style={accountStyle.statText}>Highest Points</Text>
              <Text style={accountStyle.statTextBold}>{item.my_higest_points}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Text style={accountStyle.statText}>Teams Created</Text>
              <Text style={accountStyle.statTextBold}>{item.joined_teams_count}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            // height: 35,
            flex:1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            backgroundColor: colors.screen_bg,
            justifyContent:"space-between",
            // marginTop: 5,
            borderBottomRightRadius:10,
            borderBottomLeftRadius:10
          }}>
             <Text style={[accountStyle.statText,{color:colors.black}]}>{`Fantasy Team : ${item.fantasy_higest_points}pts`}</Text>

             <View
            style={{
              width: 80,
              backgroundColor: colors.spotScarletRed,
              height: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: colors.black}}>Cricket</Text>
          </View>
          </View>
      </View>
    );
  };

  const ListHeader = () => {
    return (
      <>
        <View style={accountStyle.headerTitleContainer}>
          <Text style={accountStyle.headerTitle}>Overall Stats</Text>
        </View>
        <View style={accountStyle.statsContainer}>
          <View style={[accountStyle.statItem, {}]}>
            <Text style={accountStyle.statText}>Matches</Text>
            <Text style={accountStyle.statTextBold}>{
            matchData?.total_completed_matches_count}</Text>
          </View>
          <View style={[accountStyle.statItem, {}]}>
            <Text style={accountStyle.statText}>Contests</Text>
            <Text style={accountStyle.statTextBold}>{matchData?.total_completed_contests_count}</Text>
          </View>
          <View style={[accountStyle.statItem, {}]}>
            <Text style={accountStyle.statText}>Win Rate</Text>
            <Text style={accountStyle.statTextBold}>{matchData?.win_ret}%</Text>
          </View>
        </View>

        <View style={accountStyle.headerTitleContainer}>
          <Text style={accountStyle.headerTitle}>Recent Matches</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView
      style={[accountStyle.safeArea, {backgroundColor: colors.white}]}>
      <HeaderWithBackButton
        title="Career Stats"
        onBackButton={() => navigation.goBack()}
      />

      <View style={accountStyle.accountContainer}>
        {isLoading ? (
                  <View style={accountStyle.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.lightBlue} />
                  </View>
                ) : matchData?.completed_matches && matchData?.completed_matches.length > 0 ? (
        <FlatList
          data={matchData?.completed_matches}
          renderItem={renderMatchItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={accountStyle.listContainer}
          refreshControl={
            <RefreshControl
              tintColor={colors.lightBlue} // Change the spinner color for iOS
              refreshing={isLoading} // Controls the loading spinner
              onRefresh={() => getCompleteMatchMethod()} // Triggered when user pulls to refresh
            />
          }
          ListHeaderComponent={<ListHeader />}
        />
       ) : (
                  <View style={accountStyle.noDataContainer}>
                    <Image
                      source={require('../../Assets/No_Data_found.png')}
                      style={{height: windowWidth / 2, width: windowWidth / 2}}
                      resizeMode="cover"
                    />
                    <Text style={accountStyle.noDataText}>No Data Found!</Text>
                  </View>
                )} 
      </View>
    </SafeAreaView>
  );
}
