import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../Components/Colors';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export const commonModalStyle = StyleSheet.create({
  modal_view: {
    width: windowWidth - 20,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  modal: {
    width: windowWidth,
    marginLeft: 0,
    marginBottom: 0,
  },

  Upload_buttonText: {
    fontSize: 15,
    marginTop: 10,
    color: colors.scarletRed,
  },

  upload_button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
    height: 100,
    backgroundColor: colors.spotScarletRed,
  },

  cancel_button: {
    position: 'absolute',
    borderRadius: 20,
    padding: 5,
    backgroundColor: colors.spotScarletRed,
    right: 10,
    top: 10,
  },

  // Added new styles for PlayerInfoModal
  header: {
    backgroundColor: colors.scarletRed,
    width: '100%',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  playerImage: {
    height: windowWidth * 0.2,
    width: windowWidth * 0.2,
    borderRadius: windowWidth * 0.1,
    marginRight: 15,
  },

  playerDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    width: windowWidth * 0.6,
  },

  playerRole: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    width: windowWidth * 0.6,
  },

  playerInfo: {
    fontSize: 12,
    // fontWeight: 'bold',
    color: colors.white,
  },

  dottedLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.verylightBlue,
    // borderStyle: "dotted",
    marginVertical: 5,
  },
  headerContainer: {
    height: 30,
    backgroundColor: colors.spotScarletRed,
    justifyContent: 'center',
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rankingRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  boldText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 10,
    borderRadius: 10,
    width: windowWidth - 30,
    backgroundColor: colors.white,
  },
  sectionHeader: {
    height: 30,
    backgroundColor: colors.spotScarletRed,
    justifyContent: 'center',
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionHeaderText: {
    color: colors.black,
  },
  teamsText: {
    color: colors.black,
    padding: 10,
    fontSize: 12,
  },
});
