import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../Components/Colors';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const accountStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  accountContainer: {
    // flex: 1,
    height: windowHeight,
    backgroundColor: '#FAFAFA',
    // backgroundColor: '#E9E9E9',
  },
  playerInfo: {
    alignItems: 'center',
    marginVertical: 10,
  },
  playerImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: colors.scarletRed,
    backgroundColor: colors.white,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  matchCard: {
    height: 150,
    margin: 5,
    borderRadius: 8,
    position: 'relative',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 5,
  },
  matchCardContent: {
    // flex: 1,
    padding: 10,

    // justifyContent: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  playerBox: {
    width: windowWidth * 0.4,
    height: 80,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 15,
    color: colors.scarletRed,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  section: {
    height: 30,
    marginHorizontal: 10,
    backgroundColor: colors.spotScarletRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginTop: 15,
    borderColor: colors.newGray,
  },
  sectionText: {
    textAlign: 'center',
    fontWeight: '400',
    color: colors.scarletRed,
    // backgroundColor: '#b7dac2',
  },
  walletContainer: {
    height: 100,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  walletHeader: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    borderColor: colors.scarletRed,
  },
  walletHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.scarletRed,
  },
  icon: {
    height: 20,
    width: 20,
  },
  containerddd: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, // Optional: adds spacing around the whole container
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 15,
    color: colors.black,
  },
  labelText: {
    fontSize: 15,
    color: colors.black,
  },
  addBalanceContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 5,
    borderColor: colors.scarletRed,
    // padding: 2,  // Optional: adds padding inside the button
  },
  addBalanceText: {
    color: colors.scarletRed,
    padding: 3,
  },

  listContainer: {
    paddingBottom: 250,
  },
  transactionItem: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderWidth:0.5,
    borderColor:colors.titleColor,
    marginBottom: 12,
    borderRadius: 8,

  },
  transactionID: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.green,
  },
  transactionDate: {
    fontSize: 12,
    color: '#777',
  },
  transactionInfo: {
    marginTop: 6,
  },

  value: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDataContainer: {
    height: windowHeight - 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: colors.lightBlue,
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.titleColor,
  },
  statsContainer: {
    // padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth:0.5,
    borderColor:colors.titleColor,
    marginHorizontal: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 60,
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  statText: {
    fontSize: 14,
    color: colors.modalOpacity,
    fontWeight: '400',
  },
  statTextBold: {
    fontSize: 18,
    marginTop: 5,
    color: colors.black,
    fontWeight: '500',
  },

  matchItem: {
    marginBottom: 10,
  },
  headerSection: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  FlagImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  categoryContainer: {
    width: 80,
    backgroundColor: colors.opacityBlue,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: colors.black,
  },
  matchResultSection: {
    height: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  matchResultLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchResultRight: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  statsSection: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.opacityBlue,
    marginTop: 5,
  },
  statsLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statsRight: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  fantasyTeamSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: colors.lightBlue,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

 
});
