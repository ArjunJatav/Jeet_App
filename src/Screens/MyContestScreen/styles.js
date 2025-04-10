import {Dimensions, StyleSheet} from 'react-native';
import { colors } from '../../Components/Colors';
let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;
export const myContestStyle = StyleSheet.create({
  myContestContainer: {
    height: windowHeight,
    width: windowWidth,
    paddingHorizontal: 0,
    backgroundColor: '#FAFAFA',
  },
  sectionListContainer: {
    paddingBottom: 300,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    height: 150,
    // padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  matchDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  matchDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  matchTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  matchTitleBackGround: {
    backgroundColor: colors.black,
    // height: 28,
    // width: 50,
    alignItems: 'center',
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
  },
  matchTitleText: {
    color: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 0,
    fontSize: 14,
    fontWeight: '500',
  },
  matchTeamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 25,
  },
  matchLeftTeamRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: windowWidth / 3.33,
  },
  matchLeftCornerTeamRow: {
    height: '60%',
    width: 30,
    backgroundColor: colors.lightBlue,
    borderCurve: 'circular',
    marginRight: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  matchLeftCircleTeamRow: {
    // Circle height
    width: 20, // Circle width
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    left: 10,
    borderRadius: 50, // Make the circle
  },
  matchLeftflag: {
    width: 25,
    height: '60%',
    marginRight: 10,
    borderRadius: 10,
    zIndex: 1001,
    marginLeft: -10,
  },
  noDataContainer: {
    height: windowHeight - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.lightBlue,
    marginTop: 20,
  },
});
