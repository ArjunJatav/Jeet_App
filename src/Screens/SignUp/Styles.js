import {StyleSheet} from 'react-native';
import {colors} from '../../Components/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  passwordText: {
    color: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
  },
  fieldsContainer: {
    flex: 0.7,
    borderWidth: 1,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderColor: 'transparent',
    paddingTop: 50,
  },

  logoImage: {
    height: 180,
    width: 180,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  otpContainer: {
    flex: 0.8,
    alignItems: 'center',
  },
  otpViewContainer: {
    flexDirection: 'row',
  },
  otpBoxContainer: {
    height: 50,
    width: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.scarletRed,
  },
  otpTitleContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 50,
    flex: 0.3,
  },
  otpTitle: {
    color: colors.scarletRed,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '800',
  },
  otpSubtitle: {
    marginTop: 10,
    fontSize: 18,
    color: colors.scarletRed,
  },
  resendOtpContainer: {
    marginTop: 35,
  },
  resendOTPText: {
    color: colors.scarletRed,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 50,
  },
});
