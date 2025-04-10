import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../Components/Colors';
let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;
export const homeStyle = StyleSheet.create({
  HomeContainer: {
    height: windowHeight,
    width: windowWidth,
    paddingHorizontal: 10,
    backgroundColor:'#FAFAFA',
  },
  ContestDetailContainer: {
    height: windowHeight,
    width: windowWidth,
    // paddingHorizontal:10,
    backgroundColor: '#FAFAFA',
  },
  sectionListContainer: {
    paddingBottom: 300,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '400',
    color: '#5D6261',
    marginTop: 16,
    marginBottom: 8,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    height: 150,
    // padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth:0.5,
    borderColor:'#5D6261'
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 3, // For Android shadow
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color:'#5D6261',
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contestDetailContainer: {
    flex: 1,
  },
  topView: {
    // height: 100,
    width: windowWidth,
    backgroundColor: colors.scarletRed,
    flexDirection: 'column',
  },
  topInnerView: {
    width: windowWidth,
    backgroundColor: colors.scarletRed,
    flexDirection: 'column',
    marginVertical:5
   
  },
  maxPlayersText: {
    color: colors.white,
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: '600',
    marginVertical: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    marginVertical: 5,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: (windowWidth - 10) / 2,
  },
  teamInfo: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  teamText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '500',
  },
  flagImage: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  matchDetailsCon: {
    color: colors.white,
    fontSize: 16,
  },
  matchDetailsMargin: {
    marginHorizontal: 2,
  },
  centerView: {
    flexDirection: 'row',
    width: 10,
    alignItems: 'center',
    // marginHorizontal: 5,
    height: '100%',
  },
  divider: {
    width: 8,
    height: 3,
    backgroundColor: '#ECF2FF',
    // marginTop: 4,
  },
  playerSelectionContainer: {
    height: 25,
//  backgroundColor:"white",
    width: windowWidth,
    marginVertical:4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerBox: {
    height: 10,
    width: windowWidth / 12 - 4,
    borderRadius:5,
    marginHorizontal: 2,
  },
  container: {
    flex: 1,
    backgroundColor: colors.scarletRed,
  },
  contestDetailContainer: {
    flex: 1,
  },
  // sectionListContainer: {
  //   paddingBottom: 10,
  // },
  matchCardForContest: {
    
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: colors.white,
    borderWidth:0.5,
    borderColor:colors.titleColor,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
  cardLeft: {
    flex: 1,
    paddingHorizontal: 10,
  },
  matchTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  matchSubtitle: {
    color: colors.scarletRed,
    fontSize: 13,
    marginVertical: 5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  matchDetail: {
    color: colors.scarletRed,
    fontSize: 13,
  },
  matchHighlight: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 7,
    flexDirection: 'row',
    marginVertical: 5,
  },
  progressBarFill: {
    width: '40%',
    backgroundColor: colors.scarletRed,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  progressBarEmpty: {
    width: '60%',
    backgroundColor: colors.newGray,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  matchSpots: {
    color: colors.black,
    fontSize: 12,
  },
  cardDivider: {
    borderWidth: 1,
    borderColor: colors.lightBlue,
    borderStyle: 'dashed',
    height: '100%',
  },
  cardRight: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: 100,
  },
  entryFeeTitle: {
    color: colors.black,
    fontSize: 16,
  },
  entryFeeAmount: {
    color: colors.scarletRed,
    fontSize: 15,
  },
  joinButton: {
    borderWidth: 1.5,
    borderColor: colors.scarletRed,
    borderRadius: 15,

    paddingHorizontal: 20,
    paddingVertical: 5,
    // marginTop: 10,
  },
  joinButtonText: {
    color: colors.scarletRed,
    fontSize: 14,
    fontWeight: '600',
  },
  topBanner: {
    height: 120,
    width: windowWidth,
    backgroundColor: colors.lightBlue,
  },
  bannerOverlay: {
    backgroundColor: colors.scarletRed,
    padding: 5,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    alignSelf: 'center',
    position: 'absolute',
  },
  bannerText: {
    color: colors.white,
    fontWeight: '600',
  },
  topViewContainer: {
    height: 120,
    width: windowWidth,
    backgroundColor: colors.scarletRed,
  },
  bannerContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    bottom: 0,
  },
  bannerContent: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
  bannerText: {
    color: colors.black,
    padding: 5,
    fontWeight: '600',
  },
  mainContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: windowWidth,
  },
  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flagImage: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 5,
    zIndex: 1001,
  },
  teamName: {
    color: colors.white,
    fontSize: 16,
    marginTop: 5,
    fontWeight: '500',
  },
  vsContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 110,
  },
  vsBadge: {
    backgroundColor: colors.scarletRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  vsText: {
    color: colors.white,
    padding: 10,
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 18,
  },
  rightContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: windowWidth / 3.33,
  },
  rightTeamName: {
    marginRight: 10,
  },
  decorativeBar: {
    height: 130,
    width: 10,
    alignSelf: 'center',
    backgroundColor: '#ECF2FF',
    transform: [{rotate: '15deg'}],
  },

  tabContainer: {
    height: 40,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.modalOpacity,
    backgroundColor: colors.white,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical:10,
    alignItems: 'center',
  },
  selectedTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.scarletRed,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color:colors.black
  },
  selectedTabText: {
    color: colors.scarletRed,
  },
  headerContainer: {
    height: 40,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  tabSelectedBy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tabPoints: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCredits: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    color:colors.black

  },
  icon: {
    height: 14,
    width: 14,
    marginRight: 5,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    borderTopStartRadius:8,
    borderTopEndRadius:8,
    // marginHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',
    backgroundColor: '#F5F5F5',
  },
  matchInfo: {
    height: 90,
    justifyContent:"center"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 25,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height: 45,
  },
  teamInfoget: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent:"center",
    height: '100%',
    paddingHorizontal:10
    // width: windowWidth / 3.33,
  },
  flagContainer: {
    height: '60%',
    width: 30,
    backgroundColor: colors.lightBlue,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 5,
    position: 'relative',
  },
  flagCircle: {
    position: 'absolute',
    height: '100%',
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    left: 10,
  },
  flagImageHH: {
    width: 50,
    height: 50,
    // marginRight: 10,
    borderRadius: 10,
    zIndex: 1001,
    // marginLeft: -10,
  },
  flagImageH: {
    width: 50,
    height: 50,
    // marginRight: -5,
    borderRadius: 10,
    zIndex: 1001,
  },
  centerInfo: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    width: windowWidth / 3.33, // Takes 30% of the parent width
    height: '100%', // Matches the parent height
    flex: 1, // Takes remaining space between left and right views
  },

  footer: {
    height: 38,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    paddingHorizontal: 10,
    // backgroundColor: '#F5F5F5',
    // borderTopWidth:1,
    // borderBottomColor:"#EEEEEE"
  },
  flagContainerRight: {
    height: '60%',
    width: 30,
    backgroundColor: colors.lightBlue,
    borderBottomStartRadius: 10,
    borderTopStartRadius: 10,
  },
  flagCircleRight: {
    // Circle height
    width: 20, // Circle width
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    right: 10,
    borderRadius: 50, // Make the circle
  },

  containerCaptain: {
    height: 100,
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: colors.scarletRed,
    borderBottomColor: colors.scarletRed,
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    height: 80,
    width: 80,
  },
  captainText: {
    fontSize: 18,
    fontWeight: '400',
    color:colors.white
  },
  captainPointsText: {
    fontSize: 20,
    fontWeight: '600',
    color:colors.white
  },
  footerSelect: {
    height: 30,
    backgroundColor: 'white', // Replace with `colors.white` if needed
    flexDirection: 'row',
  },
  footerItem: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '400',
  },
  arrowIcon: {
    marginLeft: 4, // Optional for spacing between text and icon
  },
  createTeamContainer: {
    position: 'absolute',
    width: windowWidth,
    height: 40,
     backgroundColor: 'red',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  createTeamButton: {
    borderWidth: 2,
    borderColor: colors.scarletRed,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    // marginTop: 5,
    height: '100%',
    backgroundColor: colors.white,
  },
  teamHeaderData: {
    height: 40,
    backgroundColor: colors.scarletRed,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  teamcaptaionVc: {
    flex: 1,
    // height: 40,
    // backgroundColor: colors.lightBlue,
    width: '100%',
    // borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  teamcaptaionallPlayers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // borderColor: colors.lightBlue,
    // borderWidth: 1,
    backgroundColor: colors.newGray, // Dynamic background color
    borderRadius: 40,
    padding: 5,
    marginVertical: 10,
    marginHorizontal: 5, // Added horizontal margin for spacing between items
  },
});
