import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../Colors';
let windowWidth = Dimensions.get('window').width;

export const headerStyle = StyleSheet.create({
  headerWthBackButtonContainer: {
    height: 60,
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  backButtonContainer: {
    width: '10%',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '80%',
    justifyContent: 'center',
  },
  title: {
    color: colors.black,
    fontSize: 18,
  },
  headerHomeContainer: {
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  ProfileContainer: {
    width: 40,
    justifyContent: 'center',
   // alignItems: 'center',
  },
  HometitleContainer: {
    width: windowWidth - 140,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Homelogo: {
    height: 25,
    width: 25,
    borderRadius:5,
    marginRight: 5,
  },
  Hometitle: {
    color: colors.black,
    fontSize: 18,
  },
  HomeNotification: {
    justifyContent: "flex-end",
    alignItems: 'center',
    width: 70,
    flexDirection: 'row',
  },
});
