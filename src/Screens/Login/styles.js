import {StyleSheet} from 'react-native';
import {colors} from '../../Components/Colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: 120,
    width: 120,
  },
  fieldsContainer: {
    flex: 0.65,
    paddingTop: 0,
  },
  forgotpasswordContainer: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: colors.scarletRed,
    fontSize: 15,
    fontWeight: '500',
  },
  passwordText: {
    color: colors.darkBlue,
    marginHorizontal: 25,
    marginTop: 10,
  },
  titleContainer: {
    flex: 0.05,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.darkBlue,
    fontSize: 25,
    fontWeight: '800',
  },
  subTitle: {
    paddingHorizontal: 10,
    color: colors.titleColor,
    fontSize: 15,
    fontWeight: '500',
  },
  nextButtonContainer: {
    marginTop: 20,
  },
  registerTextContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  registerText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.darkBlue,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
